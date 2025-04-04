import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from fastapi import FastAPI
import logging
from src.signup import Signup


class MockPreferences:
    def db_initialise_preferences(self, username):
        print("Mocking preferences class for signup to instantiate properly")

@pytest.fixture
def test_app():
    """
    Create a FastAPI instance and attach the Signup routes
    for testing.
    """
    app = FastAPI()
    logger = logging.getLogger("test_logger")
    mock_preferences = MockPreferences()
    signup = Signup(api=app, logger=logger,
                    preferences_logic=mock_preferences)  # noqa
    return TestClient(app)


def test_signup_success(test_app):
    """
    Test for /signup endpoint where the signup is successful.
    """
    with patch("src.signup.DataBase") as mock_db_class:
        mock_db = MagicMock()
        mock_db.search_user.return_value = False
        mock_db_class.return_value = mock_db

        response = test_app.post(
            "/signup",
            json={"username": "newuser", "password": "newpassword"},
        )

    assert response.status_code == 200
    assert response.json()["message"] == "Signup successful for user: newuser"


def test_signup_user_already_exists(test_app):
    """
    Test for /signup endpoint where the username already exists.
    """
    with patch("src.signup.DataBase") as mock_db_class:
        mock_db = MagicMock()
        mock_db.search_user.return_value = True
        mock_db_class.return_value = mock_db

        response = test_app.post(
            "/signup",
            json={"username": "existinguser", "password": "newpassword"},
        )

    assert response.status_code == 200
    assert response.json()["message"] == "Username already found"


def test_signup_internal_server_error(test_app):
    """
    Test for /signup endpoint where an internal server error occurs.
    """
    with patch("src.signup.DataBase") as mock_db_class:
        mock_db = MagicMock()
        mock_db.search_user.side_effect = Exception("Database error")
        mock_db_class.return_value = mock_db

        response = test_app.post(
            "/signup",
            json={"username": "newuser", "password": "newpassword"},
        )

    assert response.status_code == 500
    assert response.json()["detail"] == "Internal server error"
