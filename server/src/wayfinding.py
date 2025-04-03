import requests
import os
from fastapi import APIRouter, Body
from dotenv import load_dotenv
from src.preferences import Preferences
import logging
from fastapi import FastAPI

load_dotenv()

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

router = APIRouter()
app = FastAPI()
logger = logging.getLogger("test_logger")
preferences = Preferences(api=app, logger=logger)


@router.post("/wayfinding/get_routes")
def get_routes(
    origin: str = Body(...),
    destination: str = Body(...),
    mode: str = Body(...),
    alternatives: bool = Body(...),
):
    url = "https://maps.googleapis.com/maps/api/directions/json"

    parameters = {
        "origin": origin,
        "destination": destination,
        "mode": mode.lower(),
        "alternatives": str(alternatives).lower(),
        "key": GOOGLE_MAPS_API_KEY,
    }
    response = requests.get(url, params=parameters)
    return response.json()


@router.post("/wayfinding/preferences/get_routes")
def get_routes_with_preferences(
    origin: str = Body(...),
    destination: str = Body(...),
    mode: str = Body(...),
    alternatives: bool = Body(...),
    username: str = Body(...),
):

    print(username)
    preferencesList = preferences.db_get_preferences(username)
    print(preferencesList)
    if not preferencesList:
        logger.error(f"No preferences found {username}. Using default route.")
        return get_routes(
            origin=origin,
            destination=destination,
            mode=mode,
            alternatives=alternatives,
        )

    if preferencesList["tolls"] and preferencesList["motorways"]:
        toAvoid = "tolls|highways"
    elif preferencesList["tolls"]:
        toAvoid = "tolls"
    elif preferencesList["motorways"]:
        toAvoid = "motorways"
    else:
        toAvoid = ""

    url = "https://maps.googleapis.com/maps/api/directions/json"
    parameters = {
        "origin": origin,
        "destination": destination,
        "mode": mode.lower(),
        "alternatives": str(alternatives).lower(),
        "key": GOOGLE_MAPS_API_KEY,
        "username": username,
        "avoid": toAvoid
    }

    response = requests.get(url, params=parameters)
    return response.json()
