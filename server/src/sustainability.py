from enum import Enum
import logging
from fastapi import Query, HTTPException
from dotenv import load_dotenv
from src.Database_class import DataBase

class VehicleEnum(Enum):
    Bus = "bus"
    Car = "car"
    Luas = "luas"
    Train = "train"
    Bike = "bike"
    Walk = "walk"

class Sustainability:
    def __init__(self, api, logger: logging.Logger):
        self.app = api
        self.logger = logger

        load_dotenv()
        # Register Endpoints
        self.api_get_sus_stats()


    def api_get_sus_stats(self):
        @self.app.get("/get_sus_stats")
        async def get_sus_stats(user: str = Query(..., alias="sender")):
            self.logger.info(
                f"Received request for sustainability statistics from {user}"
            )
            emissions_savings = self.db_fetch_sus_stats(user)

            if emissions_savings is None:
                raise HTTPException(
                    status_code=404, detail=f"User '{user}' not found"
                )

            self.logger.info("Sustainability stats retrieved")

            # Return emissions_savings as JSON
            return {"emissions_savings": emissions_savings}


    def db_fetch_sus_stats(self, user):

        table_name = "monthly_distance"
        db = DataBase()
        db.connect_db()

        if db.search_user(table_name, user):
            db.close_con()
            monthly_distances = db.return_user_row(table_name, user)
            return self.calc_emissions_savings(monthly_distances)

        else:
            db.close_con()
            return None

        


    def calc_emissions(distance: float, vehicle_type: VehicleEnum) -> float:
        """EF = E/A # EF => E = A * EF = emmisiions factor, E = total emissions,
        A = activity level (km travelled)

        Args:
            distance (float): distance travelled by vehicle in question
            vehicle_type (VehicleEnum): type of vehicle in question

        Returns:
            float: g of CO2 emitted
        """

        emission_factor = 0

        if distance < 0:
            return -1
        elif vehicle_type == "bus":
            emission_factor = 25
        elif vehicle_type == "car":
            emission_factor = 102
        elif vehicle_type == "luas":
            emission_factor = 5
        elif vehicle_type == "train":
            emission_factor = 28
        else:
            return -1

        emissions = distance * emission_factor

        return emissions


    def calc_scores(emissions_difference: float) -> float:
        if emissions_difference < 0:
            return -1

        return round(emissions_difference / 1000, 2)


    def calc_emissions_savings(self, monthly_distances):

        emissions_dif = {"bike" : 0,
                        "luas" : 0,
                        "train" : 0,
                        "bus": 0,
                        "walk" : 0,
                        }
        
        for type in VehicleEnum:
            if type == VehicleEnum.Car:
                continue
            
            # car emissions using distance travelled by transport type - transport type emissions
            emissions_dif[type.value] = self.calc_emissions(monthly_distances[type.value], VehicleEnum.Car.value) - self.calc_emissions(monthly_distances[type.value], type.value)


        return emissions_dif