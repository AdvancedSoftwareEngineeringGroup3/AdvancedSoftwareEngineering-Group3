import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from src.sustainability import Sustainability

#   Test Emissions calculating function


@pytest.fixture
def sustainability_instance():
    """
    Creates mock Sustainability instance for testing.
    """
    app = FastAPI()
    logger = MagicMock()
    return Sustainability(api=app, logger=logger)


@pytest.fixture
def test_app():
    """
    Create a FastAPI instance and attach
    """
    app = FastAPI()
    logger = MagicMock()
    sus = Sustainability(api=app, logger=logger)

    sus.api_get_sus_stats()

    return TestClient(app)


# Endpoint tests
def test_get_sus_stats_success(test_app):
    """
    Test for /get_sus_stats endpoint where user is valid
    """
    with patch("src.sustainability.DataBase") as mock_db_class:
        mock_db = MagicMock()

        # Mock db responce
        mock_db.search_user.return_value = True
        mock_db.return_user_row.side_effect = [
            {
                "bus": 100,
                "car": 200,
                "luas": 50,
                "train": 75,
                "bike": 10,
                "walk": 5,
            },  # monthly distances
            {
                "1": 342.0,
                "2": 34.0,
                "3": 277.0,
                "4": 531.0,
                "5": 234.0,
                "6": 452,
                "7": 134.9,
                "8": 262.0,
                "9": 563.0,
                "10": 237.0,
                "11": 472.0,
                "12": 123.0,
            },
            {
                "username": "test_user",
                "bike": 42,
                "car": 71,
                "luas": 22.2,
                "train": 51.5,
                "bus": 36.4,
                "walk": 63.0,
                "total": 91.0,
            },
            {"tim": 2, "tom": 56, "claude": 76, "al": 62},
        ]
        mock_db.search_entry.return_value = ["Friend1", "Friend2"]
        mock_db_class.return_value = mock_db

        # Send test request
        response = test_app.get("/get_sus_stats?sender=test_user")
        data = response.json()

        assert response.status_code == 200
        assert "emissions_savings" in data
        assert "current_year_emissions" in data
        assert "raw_distances" in data
        assert "friends_sus_scores" in data


def test_get_sus_stats_user_not_found(test_app):
    """
    Test for /get_sus_stats endopint with invalid user
    """

    with patch("src.sustainability.DataBase") as mock_db_class:
        mock_db = MagicMock()
        mock_db.search_user.return_value = False  # user not found
        mock_db_class.return_value = mock_db

        response = test_app.get("/get_sus_stats?sender=invalid_user")

        assert response.status_code == 404
        assert response.json() == {"detail": "User 'invalid_user' not found"}


def test_db_fetch_month_sus_stats(sustainability_instance):
    with patch("src.sustainability.DataBase") as mock_db_class:
        mock_db = MagicMock()
        mock_db.search_user.return_value = True
        mock_db.return_user_row.return_value = {
            "bus": 100,
            "car": 200,
            "luas": 50,
            "train": 75,
            "bike": 10,
            "walk": 5,
        }
        mock_db_class.return_value = mock_db

        result = sustainability_instance.db_fetch_month_sus_stats("test_user")

        assert result == {
            "bus": 7700,
            "luas": 4850,
            "train": 5550,
            "bike": 1020,
            "walk": 510,
        }

        mock_db.search_user.assert_called_once_with(
            "monthly_distance", "test_user"
        )
        mock_db.return_user_row.assert_called_once_with(
            "monthly_distance", "test_user"
        )


def test_calc_emissions_valid_input(sustainability_instance):
    result = sustainability_instance.calc_emissions(10, "car")
    assert result == 1020


def test_calc_scores_valid_input(sustainability_instance):
    result = sustainability_instance.calc_scores(2000)
    assert result == 2.0  # 2000 / 1000 = 2.0


def test_emissions_savings(sustainability_instance):
    monthly_distances = {
        "bus": 100,
        "car": 200,
        "luas": 50,
        "train": 75,
        "bike": 10,
        "walk": 5,
    }

    with patch.object(
        sustainability_instance,
        "calc_emissions",
        side_effect=[10200, 2500, 5100, 250, 7650, 2100, 1020, 0, 510, 0],
    ):
        result = sustainability_instance.calc_emissions_savings(
            monthly_distances
        )

        assert result == {
            "bus": 7700,
            "luas": 4850,
            "train": 5550,
            "bike": 1020,
            "walk": 510,
        }

def test_db_update_monthly_distances_success(sustainability_instance):
    """
    Test for successful update of monthly distances
    """
    with patch("src.sustainability.DataBase") as mock_db_class:
        mock_db = MagicMock()
        mock_db.search_user.return_value = True
        mock_db.return_user_row.return_value = {
            "username": "test_user",
            "bike": 10,
            "car": 20,
            "luas": 30,
            "train": 50,
            "bus": 80,
            "walk": 20,
            "total": 210,
        }

        mock_db_class.return_value = mock_db

        journey_data = {
            "bike": 5,
            "car": 15,
            "luas": 10,
            "train": 10,
            "bus": 20,
            "walk": 5
        }

        result = sustainability_instance.db_update_monthly_distances("test_user", journey_data)

        assert result is True
        mock_db.search_user.assert_called_once_with("monthly_distance", "test_user")

        # Verify that update_entry was called with correct parameters for each transport mode
        assert mock_db.update_entry.call_count == 6

        assert mock_db.update_entry_any_call("monthly_distance", "test_user", "bike", 15)
        assert mock_db.update_entry_any_call("monthly_distance", "test_user", "car", 35)
        assert mock_db.update_entry_any_call("monthly_distance", "test_user", "luas", 40)
        assert mock_db.update_entry_any_call("monthly_distance", "test_user", "train", 60)
        assert mock_db.update_entry_any_call("monthly_distance", "test_user", "bus", 100)
        assert mock_db.update_entry_any_call("monthly_distance", "test_user", "walk", 25)


def test_calc_scores_from_route_success(sustainability_instance):
    """
    Test for successful calculation of scores from route
    """
    journey_data = {
        "bike": 10,
        "car": 0,
        "luas": 20,
        "train": 15,
        "bus": 5,
        "walk": 8
    }

    with patch.object(
        sustainability_instance,
        "calc_emissions_savings",
        return_value={
            "bike": 1020,  # 10 * 102 - 10 * 0 = 1020
            "luas": 1940,  # 20 * 102 - 20 * 5 = 1940
            "train": 1110,  # 15 * 102 - 15 * 28 = 1110
            "bus": 385,    # 5 * 102 - 5 * 25 = 385
            "walk": 816    # 8 * 102 - 8 * 0 = 816
        }
    ):
        # Also patch calc_scores to return known values
        with patch.object(
            sustainability_instance,
            "calc_scores",
            side_effect=[1.02, 1.94, 1.11, 0.39, 0.82]  # Values divided by 1000 and rounded
        ):
            result = sustainability_instance.calc_scores_from_route("test_user", journey_data)
            
            assert result == 5.28  # Sum of all scores: 1.02 + 1.94 + 1.11 + 0.39 + 0.82 = 5.28
            sustainability_instance.calc_emissions_savings.assert_called_once_with(journey_data)
            
            # Check that calc_scores was called for each transport mode except car
            assert sustainability_instance.calc_scores.call_count == 5


def test_car_calc_emissions(sustainability_instance):
    assert sustainability_instance.calc_emissions(7, "car") == 714


def test_bus_calc_emissions(sustainability_instance):
    assert sustainability_instance.calc_emissions(7, "bus") == 175


def test_invalid_distance_calc_emissions(sustainability_instance):
    assert sustainability_instance.calc_emissions(-7, "car") == -1


def test_invalid_vehicle_calc_emissions(sustainability_instance):
    assert sustainability_instance.calc_emissions(7, "x") == -1


# Test score calculating function
def test_valid_input_calc_scores(sustainability_instance):
    assert sustainability_instance.calc_scores(138.6) == 0.14


def test_invalid_input_calc_scores(sustainability_instance):
    assert sustainability_instance.calc_scores(-1) == -1
