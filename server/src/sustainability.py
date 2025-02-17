from enum import Enum


class VehicleEnum(Enum):
    Bus = 'b'
    Car = 'c'
    Luas = 'l'
    Train = 't'


def calc_emissions(distance: float, vehicle_type: VehicleEnum) -> float:
    """EF = E/A # EF => E = A * EF = emmisiions factor, E = total emissions,
    A = activity level (km travelled)

    Args:
        distance (float): distance travelled by vehicle in question
        vehicle_type (VehicleEnum): type of vehicle in question

    Returns:
        float: Kg of CO2 emitted
    """

    emission_factor = 0

    if distance < 0:
        return -1
    elif vehicle_type == 'b':
        emission_factor = 25
    elif vehicle_type == 'c':
        emission_factor = 102
    elif vehicle_type == 'l':
        emission_factor = 5
    elif vehicle_type == 't':
        emission_factor = 28
    else:
        return -1

    emissions = distance * emission_factor

    return emissions


def calc_scores(emissions_difference: float) -> float:
    """Function calculates sustainibility score based on the save carbon emissions of taking public transport vs a car

    Args:
        emissions_difference (float): differences in journies

    Returns:
        float: sustainibility score
    """
    if emissions_difference < 0:
        return -1

    return round(emissions_difference / 100, 2)
