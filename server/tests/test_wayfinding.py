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

    response = get_routes(origin, destination, mode, alternatives)
    assert response.get("status") == "OK"


def test_calculate_route_missing_params():
    # missing parameters test

    response = get_routes("", "", "", "")
    assert response.get("status") == "INVALID_REQUEST"


def test_calculate_route_api_key():
    # wrong API key

    origin = "Tara Street"
    Destination = "Ashbourne"
    mode = "Walking"
    key = "SAjhdgfsjkg67345834"

    response = get_routes(
        origin, Destination, mode, alternatives="TRUE"
    )

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
        response = get_routes(origin, destination, mode, alternatives)

        if response["routes"]:
            first_route = response["routes"][0]
            if first_route["legs"]:
                first_leg = first_route["legs"][0]
                if first_leg["steps"]:
                    # true == 1 --> check second leg for transit,
                    # false == 0 --> otherwise check the first leg
                    first_step = first_leg["steps"][mode == "transit"]
                    travel_mode = first_step["travel_mode"]
                    print(f"Travel mode for the route: {travel_mode}")
                else:
                    print("No steps found in the leg.")
            else:
                print("No legs found in the route.")
        else:
            print("No routes found in the response.")

        assert travel_mode.lower() == mode
