from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect

# from src.wayfinding import router  # Import the API routes
from wayfinding import router  # Import the API routes
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging
import uvicorn
import sys
from src.signup import Signup
from src.login import Login
from src.weatherApi import weatherAPI
from src.preferences import Preferences
from src.networking import Networking


class Server:
    def __init__(self):
        # Configure logging
        self.logger = self.configure_logging()

        # Initialize FastAPI app
        self.app = FastAPI()
        # Include the API routes from the my_routes.py file
        self.app.include_router(router)

        # Instantiate components
        self.signup_logic = Signup(self.app, self.logger)
        self.login_logic = Login(self.app, self.logger)
        self.preferences_logic = Preferences(self.app, self.logger)
        self.connection_manager = ConnectionManager()
        self.weather_api = weatherAPI()
        self.networking = Networking(self.app, self.logger)

        # Configure CORS
        self.configure_cors()

        # Add middleware
        self.add_middlewares()

        # Register routes
        self.register_routes()

        # Signup function
        # self.signup_logic.handle_signup()

        # Login function
        # self.login_logic.handle_login()

    def configure_logging(self):
        """configure logging in server

        Returns:
            logging object: logging object
        """
        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s - %(levelname)s - %(message)s",
            handlers=[logging.StreamHandler(sys.stdout)],
        )
        return logging.getLogger(__name__)

    def configure_cors(self):
        origins = ["*"]  # In production, replace with actual frontend URL
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    def add_middlewares(self):
        @self.app.middleware("http")
        async def log_requests(request: Request, call_next):
            self.logger.info(
                f"Incoming {request.method} request to {request.url}"
            )
            response = await call_next(request)
            self.logger.info(
                f"Returning response with status code: {response.status_code}"
            )
            return response

    def register_routes(self):
        @self.app.get("/")
        async def root():
            self.logger.info("Root endpoint accessed")
            return {"message": "Hello from main"}

        @self.app.post("/echo")
        async def echo_message(message: Message):
            self.logger.info(
                f"Received message in echo endpoint: {message.text}"
            )
            try:
                return {"message": f"'{message.text}' sent from server"}
            except Exception as e:
                self.logger.error(f"Error processing message: {str(e)}")
                raise

        @self.app.get("/weather")
        async def get_weather():
            self.logger.info(f'{"Received weather API request"}')
            try:
                # Example coordinates for Dublin
                return self.weather_api.get(lat="-6.266155", lng="53.350140")
            except Exception as e:
                self.logger.error(f"Error hitting weather endpoint: {e}")
                raise

        @self.app.websocket("/ws/location")
        async def websocket_endpoint(websocket: WebSocket):
            await self.connection_manager.connect(websocket)
            try:
                while True:
                    data = await websocket.receive_text()
                    self.logger.info(f"Received data: {data}")
                    await self.connection_manager.broadcast(
                        f"Received location: {data}"
                    )
            except WebSocketDisconnect:
                self.connection_manager.disconnect(websocket)
                self.logger.info("WebSocket disconnected")
            except Exception as e:
                self.logger.error(f"Unexpected error: {e}")
                await websocket.close(code=1006)

    def run(self, host="0.0.0.0", port=8000):
        self.logger.info("Starting FastAPI server...")
        uvicorn.run(self.app, host=host, port=port, log_level="debug")


class Message(BaseModel):
    text: str


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)


# Instantiate server
server = Server()
app = server.app

if __name__ == "__main__":
    server.run()
