from sustainability import calc_emissions, calc_scores
import pytest


#   Test Emissions calculating function


def test_car_calc_emissions():
    assert calc_emissions(7, "c") == 714


def test_bus_calc_emissions():
    assert calc_emissions(7, "b") == 175


def test_train_calc_emissions():
    assert calc_emissions(7, "t") == 196


def test_luas_calc_emissions():
    assert calc_emissions(7, "l") == 35


def test_invalidDistance_calc_emissions():
    assert calc_emissions(-7, "c") == -1


def test_invalid_Vehichle_calc_emissions():
    assert calc_emissions(7, "x") == -1


# Test score calculating function


def test_validInput_calc_scores():
    assert calc_scores(138.6) == 1.39


def test_invalidInput_calc_scores():
    assert calc_scores(-1) == -1
