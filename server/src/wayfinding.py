import requests
import os
from fastapi import APIRouter, Body
from dotenv import load_dotenv
import logging
from src.preferences import Preferences

load_dotenv()

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

router = APIRouter()
logger = logging.getLogger("test_logger")


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
    data = response.json()

    if data.get("status") != "OK":
        return {
            "error": True,
            "status": data.get("status"),
            "message": data.get(
                "error_message", "Could not retrieve directions."
            ),
        }

    return data  # Return full successful response


def wayfinding_router_setup(preferences_logic: Preferences, logger):
    router = APIRouter()

    @router.post("/preferences/get_routes")
    def get_routes_with_preferences(
        origin: str = Body(...),
        destination: str = Body(...),
        mode: str = Body(...),
        alternatives: bool = Body(...),
        username: str = Body(...),
    ):

        print(username)
        preferencesList = preferences_logic.db_get_preferences(username)
        print(preferencesList)
        if not preferencesList:
            logger.error(f"No preferences {username}. Using default route.")
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
        data = response.json()

        if data.get("status") != "OK":
            return {
                "error": True,
                "status": data.get("status"),
                "message": data.get(
                    "error_message", "Could not retrieve directions."
                ),
            }

        return data  # Return full successful response

    return router
