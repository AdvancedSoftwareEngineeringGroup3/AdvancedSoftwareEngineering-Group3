import pytest
from fastapi import FastAPI
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


def test_car_calc_emissions(sustainability_instance):
    assert sustainability_instance.calc_emissions(7, "car") == 714


def test_bus_calc_emissions(sustainability_instance):
    assert sustainability_instance.calc_emissions(7, "bus") == 175


def test_train_calc_emissions(sustainability_instance):
    assert sustainability_instance.calc_emissions(7, "train") == 196


def test_luas_calc_emissions(sustainability_instance):
    assert sustainability_instance.calc_emissions(7, "luas") == 35


def test_invalid_distance_calc_emissions(sustainability_instance):
    assert sustainability_instance.calc_emissions(-7, "car") == -1


def test_invalid_vehicle_calc_emissions(sustainability_instance):
    assert sustainability_instance.calc_emissions(7, "x") == -1


# Test score calculating function


def test_valid_input_calc_scores(sustainability_instance):
    assert sustainability_instance.calc_scores(138.6) == 0.14


def test_invalid_input_calc_scores(sustainability_instance):
    assert sustainability_instance.calc_scores(-1) == -1
