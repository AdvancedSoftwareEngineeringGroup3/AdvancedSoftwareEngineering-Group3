import os
from src.wayfinding import get_routes
from dotenv import load_dotenv

load_dotenv()


def test_calculate_route():

    origin = "Tara Street"
    Destination = "Ashbourne Meath"
    mode = "Walking"
    alternatives = "true"
    key = os.getenv("GOOGLE_MAPS_API_KEY")

    response = get_routes(origin, Destination, mode, alternatives, key)

    assert response.get("status") == "OK"


def test_calculate_route_missing_params():
    # missing parameters test

    response = get_routes("", "", "", "", "")

    assert response.get("status") == "INVALID_REQUEST"


def test_calculate_route_api_key():
    # wrong API key

    origin = "Tara Street"
    Destination = "Ashbourne"
    mode = "Walking"

    response = get_routes(
        origin, Destination, mode, alternatives="TRUE", key="Ahdlkjhfdadsf1234sxf"
    )

    assert response.get("status") == "REQUEST_DENIED"
