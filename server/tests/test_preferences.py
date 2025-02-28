import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from fastapi import FastAPI
import logging
from src.preferences import Preferences

@pytest.fixture
def test_app():
    """
    Create a FastAPI instance and attach the Networking routes
    for testing.
    """
    app = FastAPI()
    logger = logging.getLogger("test_logger")
    pref = Preferences(api=app, logger=logger)

    pref.set_Preferences()
   
    return TestClient(app)

# def test_save_user_preferences(test_app):
#     """
#     Test for /setPreferences endpoint to ensure user preferences
#     can be saved from the client to the database
#     """

#     # Patch DB class to avoid interacting with real DB
#     with patch("src.networking.DataBase") as mock_db_class:
#         # Mock DB instance
#         mock_db = MagicMock()

#         # Receiver exists
#         # mock_db.search_user.return_value = True

#         # 'sender' not in 'pending_friends' array
#         # mock_db.search_entry.return_value = []

#         mock_db.add_entry.return_value = []
        

#         mock_db_class.return_value = mock_db

#         user_preferences = {
#             "username": "siobhan",
#             "bike": True,
#             "privateVehicle": False,
#             "accessibility": True,
#             "motorways": False,
#             "tolls": True,
#             "bus": False,
#             "car": True,
#             "train": False,
#             "walk": True,
#             "tram": False,
#             "personalBike": True
#         }
        
#         # Send test request
#         response = test_app.post(
#             "/setPreferences", json=user_preferences
#         )

#     # TODO: Maybe add in response codes

#     # Verify correct JSON returned
#     data = response.json()

#     print(f"Data response {data}")

#     assert data["message"] == "Successfully saved user preferences"
#     # assert data.message == "Friend request to Bob sent successfully"

#     mock_db.add_entry.assert_called_once_with("user_personalized_settings", user_preferences)
    
