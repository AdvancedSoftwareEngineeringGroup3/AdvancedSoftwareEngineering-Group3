import pytest
import os
from src.wayfinding import get_routes
from dotenv import load_dotenv

load_dotenv()

def test_calculate_route():
    
    origin = "Tara Street"
    destination = "Ashbourne Meath"
    mode = "Walking"
    alternatives = "true"
    key = os.getenv("GOOGLE_MAPS_API_KEY")
    
    response = get_routes(origin, destination, mode, alternatives, key)
    
    assert response.get("status") == 'OK'
    
def test_calculate_route_missing_params():
    # missing parameters test
    
    response = get_routes('', '', '', '')
    
    assert response.get("status") == 'INVALID_REQUEST'
    
    
def test_calculate_route_api_key():
    # wrong API key
    
    origin = "Tara Street"
    Destination = "Ashbourne"
    mode = "Walking"
    key = "SAjhdgfsjkg67345834"

    response = get_routes(origin, Destination, mode, alternatives = 'TRUE', key = key)

    assert response.get("status") == "REQUEST_DENIED"


def test_check_transport_modes():


    origin = "Tara Street"
    destination = "Ashbourne Meath"
    mode = "Walking"
    alternatives = "true"
    key = os.getenv("GOOGLE_MAPS_API_KEY")
    modes = ["driving", "walking", "transit", "bicycling"]

    response = ""

    for mode in modes:
        response = get_routes(origin, destination, mode, alternatives, key=key)
    
    assert response.get("status") == "OK"
    
