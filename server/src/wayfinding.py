import requests
import os
from fastapi import APIRouter, Body
from dotenv import load_dotenv

load_dotenv()

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

router = APIRouter()


@router.post("/wayfinding/get_routes")
def get_routes(
    origin: str = Body(...),
    destination: str = Body(...),
    mode: str = Body(...),
    alternatives: bool = Body(...),
):
    url = "https://maps.googleapis.com/maps/api/directions/json"
    # url = "https://maps.googleapis.com/maps/directions/v2:computeRoutes"

    parameters = {
        "origin": origin,
        "destination": destination,
        "mode": mode.lower(),
        "alternatives": str(alternatives).lower(),
        "key": GOOGLE_MAPS_API_KEY,
    }
    # if mode == driving
    # parse response ... routes
    # get speed limit for each step of leg
    # retrurn list of limits for each step of each leg

    response = requests.get(url, params=parameters)
    data = response.json()


    if data.get("status") != "OK":
        return {
            "error": True,
            "status": data.get("status"),
            "message": data.get("error_message", "Could not retrieve directions."),
        }

    return data  # Return full successful response
