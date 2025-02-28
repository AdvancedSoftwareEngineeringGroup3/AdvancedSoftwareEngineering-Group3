import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from fastapi import FastAPI
import logging
from src.networking import Networking

# from src.Database_class import DataBase


@pytest.fixture
def test_app():
    """
    Create a FastAPI instance and attach the Networking routes
    for testing.
    """
    app = FastAPI()
    logger = logging.getLogger("test_logger")
    net = Networking(api=app, logger=logger)

    net.api_send_friend_request()
    net.api_fetch_all_friends()
    net.api_friend_request_response()

    return TestClient(app)


def test_send_friend_request_success(test_app):
    """
    Test for /send_request endpoint where user is valid
    and has not already sent a request
    """

    # Patch DB class to avoid interacting with real DB
    with patch("src.networking.DataBase") as mock_db_class:
        # Mock DB instance
        mock_db = MagicMock()

        # Receiver exists
        mock_db.search_user.return_value = True

        # 'sender' not in 'pending_friends' array
        mock_db.search_entry.return_value = []

        mock_db_class.return_value = mock_db

        # Send test request
        response = test_app.post(
            "/send_request",
            json={"sender": "Alice", "receiver": "Bob"},
        )

    # TODO: Maybe add in response codes

    # Verify correct JSON returned
    data = response.json()

    print(f"Data response {data}")

    assert data["message"] == "Friend request to Bob sent successfully"
    # assert data.message == "Friend request to Bob sent successfully"

    mock_db.search_user.assert_called_once_with("user_table", "Bob")
    mock_db.search_entry.assert_called_once_with(
        "user_table", "Bob", "pending_friends"
    )


def test_send_request_self(test_app):
    """
    Test user cannot send request to themself
    """
    response = test_app.post(
        "/send_request",
        json={"sender": "Alice", "receiver": "Alice"},
    )
    print(f"Response {response.json()}")

    assert response.json()["message"] == "Cannot send request to self"


def test_send_friend_request_duplicate(test_app):
    """
    Test when duplicate request is sent
    """
    with patch("src.networking.DataBase") as mock_db_class:
        mock_db = MagicMock()
        mock_db.search_user.return_value = True

        # List contains sender => already pending request
        mock_db.search_entry.return_value = ["Alice"]
        mock_db_class.return_value = mock_db

        response = test_app.post(
            "/send_request",
            json={"sender": "Alice", "receiver": "Bob"},
        )

    assert response.json()["message"] == "Friend request already sent"


def test_send_friend_request_user_not_found(test_app):
    """
    Test when seding a friend request to user that does
    not exist
    """
    with patch("src.networking.DataBase") as mock_db_class:
        mock_db = MagicMock()
        # search_user returns False => user not found
        mock_db.search_user.return_value = False
        mock_db_class.return_value = mock_db

        response = test_app.post(
            "/send_request",
            json={"sender": "Alice", "receiver": "GhostUser"},
        )

    assert response.json()["message"] == 'User "GhostUser" not found'


def test_check_requests(test_app):
    """
    Test the /check_requests endpoint which fetches current friends
    and pending friends for a given user.
    """
    with patch("src.networking.DataBase") as mock_db_class:
        mock_db = MagicMock()

        mock_db.search_entry.side_effect = [["Bob", "Charlie"], ["Dave"]]
        mock_db_class.return_value = mock_db

        # The endpoint is a POST expecting just the username in the payload
        response = test_app.post("/check_requests", json={"user": "Alice"})
        data = response.json()

        print(f"Response: {data}")
        assert data["friends"] == ["Bob", "Charlie"]
        assert data["pending_friends"] == ["Dave"]


def test_request_response_accepted(test_app):
    """
    Test when friend request is accepted, remove requester from pending_friends
    + add each user to the other's friend_list
    """
    with patch("src.networking.DataBase") as mock_db_class:
        mock_db = MagicMock()

        # search_user returns True => user exists
        mock_db.search_user.return_value = True
        mock_db_class.return_value = mock_db

        response = test_app.post(
            "/request_response",
            json={"user": "Alice", "requester": "Bob", "answer": True},
        )

    # TODO: status codes
    print(f"{response.json()}")
    assert response.json()["message"] == "New friend Bob added"

    # Check DB calls
    mock_db.remove_from_array.assert_called_once_with(
        "user_table", "Alice", "pending_friends", "Bob"
    )
    mock_db.append_entry.assert_any_call(
        "user_table", "Bob", "Alice", "friends_list"
    )
    mock_db.append_entry.assert_any_call(
        "user_table", "Alice", "Bob", "friends_list"
    )


def test_request_response_rejected(test_app):
    """
    Test when friend request is rejected, should:
    remove the requester from pending_friends, but:
    not add them to friends_list
    """
    with patch("src.networking.DataBase") as mock_db_class:
        mock_db = MagicMock()
        mock_db.search_user.return_value = True
        mock_db_class.return_value = mock_db

        response = test_app.post(
            "/request_response",
            json={"user": "Alice", "requester": "Bob", "answer": False},
        )

    # TODO: Responce codes
    assert response.json()["message"] == "Friend request declined"

    # Check DB calls
    mock_db.remove_from_array.assert_called_once_with(
        "user_table", "Alice", "pending_friends", "Bob"
    )

    # Make sure no calls were made to append entries for either user
    mock_db.append_entry.assert_not_called()
