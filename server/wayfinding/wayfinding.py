import requests
import json


def get_routes(origin, destination, mode, alternatives, key):
    url = "https://maps.googleapis.com/maps/api/directions/json"

    parameters = {
        "origin": origin,
        "destination": destination,
        "mode": mode,
        "alternatives": alternatives,
        "key": key
    }

    response = requests.get(url, params=parameters)
    
    return response.json()
