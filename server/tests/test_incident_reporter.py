import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from fastapi import FastAPI
import logging
from src.incident_reporter import IncidentReporter


@pytest.fixture
def test_app():
    """
    Create a FastAPI instance and attach the IncidentReporter routes
    for testing.
    """
    app = FastAPI()
    logger = logging.getLogger("test_logger")
    incident_reporter = IncidentReporter(api=app, logger=logger)  # noqa: F841
    return TestClient(app)


def test_report_incident_success(test_app):
    """
    Test for /report_incident endpoint where the incident is
    reported successfully.
    """
    with patch("src.incident_reporter.DataBase") as mock_db_class:
        mock_db = MagicMock()
        mock_db.add_entry.return_value = None  # Simulate successful DB entry
        mock_db_class.return_value = mock_db

        incident_data = {
            "type": "accident",
            "title": "Accident",
            "comment": "Test comment",
            "timestamp": "2025-03-28T12:00:00Z",
            "location": {
                "latitude": 40.7128,
                "longitude": -74.006,
            },
        }

        response = test_app.post("/report_incident", json=incident_data)

    assert response.status_code == 200
    assert response.json()["message"] == "Incident report sent successfully"


def test_report_incident_invalid_data(test_app):
    """
    Test for /report_incident endpoint where invalid data is sent.
    """
    invalid_data = {
        "type": "accident",
        "title": "Accident",
        # Missing required fields like "comment", "timestamp", and "location"
    }

    response = test_app.post("/report_incident", json=invalid_data)

    assert response.status_code == 422  # Unprocessable Entity
    assert "detail" in response.json()


def test_report_incident_internal_server_error(test_app):
    """
    Test for /report_incident endpoint where an internal server error occurs.
    """
    with patch("src.incident_reporter.DataBase") as mock_db_class:
        mock_db = MagicMock()
        mock_db.add_entry.side_effect = Exception(
            "Database error"
        )  # Simulate DB error
        mock_db_class.return_value = mock_db

        incident_data = {
            "type": "accident",
            "title": "Accident",
            "comment": "Test comment",
            "timestamp": "2025-03-28T12:00:00Z",
            "location": {
                "latitude": 40.7128,
                "longitude": -74.006,
            },
        }

        response = test_app.post("/report_incident", json=incident_data)

    assert response.status_code == 200
    assert response.json()["message"] == "Error reporting incident"
