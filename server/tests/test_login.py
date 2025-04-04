import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from fastapi import FastAPI
import logging
from src.login import Login


@pytest.fixture
def test_app():
    """
    Create a FastAPI instance and attach the Login routes
    for testing.
    """
    app = FastAPI()
    logger = logging.getLogger("test_logger")
    login = Login(api=app, logger=logger)  # noqa: F841
    return TestClient(app)


def test_login_success(test_app):
    """
    Test for /login endpoint where the login is successful.
    """
    with patch("src.login.DataBase") as mock_db_class:
        mock_db = MagicMock()
        mock_db.search_user.return_value = True
        mock_db.search_entry.return_value = "testpassword"
        mock_db_class.return_value = mock_db

        response = test_app.post(
            "/login",
            json={"username": "testuser", "password": "testpassword"},
        )

    assert response.status_code == 200
    assert response.json()["message"] == "Login successful for user: testuser"


def test_login_invalid_user(test_app):
    """
    Test for /login endpoint where the username is invalid.
    """
    with patch("src.login.DataBase") as mock_db_class:
        mock_db = MagicMock()
        mock_db.search_user.return_value = False
        mock_db_class.return_value = mock_db

        response = test_app.post(
            "/login",
            json={"username": "invaliduser", "password": "testpassword"},
        )

    assert response.status_code == 200
    assert response.json()["message"] == "Invalid username or password"


def test_login_invalid_password(test_app):
    """
    Test for /login endpoint where the password is invalid.
    """
    with patch("src.login.DataBase") as mock_db_class:
        mock_db = MagicMock()
        mock_db.search_user.return_value = True
        mock_db.search_entry.return_value = "correctpassword"
        mock_db_class.return_value = mock_db

        response = test_app.post(
            "/login",
            json={"username": "testuser", "password": "wrongpassword"},
        )

    assert response.status_code == 200
    assert response.json()["message"] == "Invalid username or password"


def test_login_internal_server_error(test_app):
    """
    Test for /login endpoint where an internal server error occurs.
    """
    with patch("src.login.DataBase") as mock_db_class:
        mock_db = MagicMock()
        mock_db.search_user.side_effect = Exception("Database error")
        mock_db_class.return_value = mock_db

        response = test_app.post(
            "/login",
            json={"username": "testuser", "password": "testpassword"},
        )

    assert response.status_code == 500
    assert response.json()["detail"] == "Internal server error"
