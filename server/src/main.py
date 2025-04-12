from fastapi import FastAPI, Request, Query

from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging
import uvicorn
import sys
from src.signup import Signup
from src.login import Login
from src.preferences import router as preferences_router
from src.weatherApi import weatherAPI
from src.preferences import Preferences
from src.networking import Networking
from src.incident_reporter import IncidentReporter
from src.wayfinding import wayfinding_router_setup
from src.sustainability import Sustainability
from src.dublin_bike_api import bikeAPI


class Server:
    def __init__(self):
        # Configure logging
        self.logger = self.configure_logging()

        # Initialize FastAPI app
        self.app = FastAPI()
        # Include the API routes from the my_routes.py file

        # Instantiate components

        self.login_logic = Login(self.app, self.logger)
        self.weather_api = weatherAPI()
        self.bike_api = bikeAPI()
        self.networking = Networking(self.app, self.logger)
        self.preferences_logic = Preferences(self.app, self.logger)
        self.sustainability = Sustainability(self.app, self.logger)
        self.signup_logic = Signup(
            self.app, self.logger, self.preferences_logic, self.sustainability
        )

        wayfinding_router = wayfinding_router_setup(
            preferences_logic=self.preferences_logic,
            logger=self.logger,
        )

        self.app.include_router(wayfinding_router, prefix="/wayfinding")
        self.app.include_router(preferences_router, prefix="/preferences")
        self.incident_reporter = IncidentReporter(self.app, self.logger)

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
        async def get_weather(
            longitude: str = Query(...), latitude: str = Query(...)
        ):
            self.logger.info(
                f"Received weather API request: lat={latitude}, lng={longitude}"  # noqa: E501
            )
            try:
                realtimeweatherdata, temperature = self.weather_api.get(
                    lat=latitude, lng=longitude
                )
                print(f"Temperature: {temperature}")
                return {
                    "weather": realtimeweatherdata,
                    "temperature": temperature,
                }
            except Exception as e:
                self.logger.error(f"Error hitting weather endpoint: {e}")
                raise

        @self.app.get("/BikeStand")
        async def get_bikeStand(
            longitude: str = Query(...), latitude: str = Query(...)
        ):
            self.logger.info(
                f"Received bike API request: lat={latitude}, lng={longitude}"
            )
            try:
                realtimeBikeInfo = self.bike_api.get(
                    lat=latitude, lng=longitude
                )
                print(f"real time bike info: {realtimeBikeInfo}")

                return {"BikeInfo": realtimeBikeInfo}
            except Exception as e:
                self.logger.error(f"Error hitting BikeApi endpoint: {e}")
                raise

    def run(self, host="0.0.0.0", port=8000):
        self.logger.info("Starting FastAPI server...")
        uvicorn.run(self.app, host=host, port=port, log_level="debug")


class Message(BaseModel):
    text: str


# Instantiate server
server = Server()
app = server.app

if __name__ == "__main__":
    server.run()
