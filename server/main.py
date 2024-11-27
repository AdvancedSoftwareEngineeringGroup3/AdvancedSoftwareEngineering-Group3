from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import logging
import uvicorn
import sys
from apis.weatherApi import weatherAPI

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger(__name__)

class Message(BaseModel):
    text: str

app = FastAPI()

# Configure CORS with logging
origins = ["*"]  # In production, replace with actual frontend URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Incoming {request.method} request to {request.url}")
    response = await call_next(request)
    logger.info(f"Returning response with status code: {response.status_code}")
    return response

@app.get("/")
async def root():
    logger.info("Root endpoint accessed")
    return {"message": "Hello World"}

@app.post("/echo")
async def echo_message(message: Message):
    logger.info(f"Received message in echo endpoint: {message.text}")
    try:
        return {"message": f"'{message.text}' sent from server"}
    except Exception as e:
        logger.error(f"Error processing message: {str(e)}")
        raise

weather = weatherAPI()
@app.get("/weather")
async def root():
    logger.info(f"Received function call from client")
    try:
        return weather.get(lat='-6.266155', lng='53.350140') # Dublin
    except Exception as e:
        logger.error("Error hitting weather endpoint")
        raise


if __name__ == "__main__":
    logger.info("Starting FastAPI server...")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="debug")
