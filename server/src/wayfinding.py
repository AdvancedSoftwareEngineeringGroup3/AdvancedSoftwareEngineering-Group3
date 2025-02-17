import requests
import os
import json
from fastapi import FastAPI
from fastapi import APIRouter, Query, Body
from dotenv import load_dotenv

load_dotenv()

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")

router = APIRouter()

@router.post("/wayfinding/get_routes")
def get_routes(origin: str = Body(...),
    destination: str = Body(...),
    mode: str = Body(...),
    alternatives: bool = Body(...),
    key: str = Body(GOOGLE_MAPS_API_KEY)
    ):
    url = "https://maps.googleapis.com/maps/api/directions/json"


    parameters = {
        "origin": origin,
        "destination": destination,
        "mode": mode.lower(),
        "alternatives": str(alternatives).lower(),
        "key": key
    }

    print("parameters are ok!")

    response = requests.get(url, params=parameters)
    
    return response.json()
