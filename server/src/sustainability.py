from enum import Enum
import logging
from fastapi import Query, HTTPException
from dotenv import load_dotenv
from .Database_class import DataBase

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

        self.vehicle_types = ["bus", "car", "luas", "train", "bike", "walk"]

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
            self.logger.info(f"Emissions savings: {emissions_savings}")

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
            self.logger.info("Found user")
            self.logger.info("connection closed, getting monthly distances")
            monthly_distances = db.return_user_row(table_name, user)
            self.logger.info(f"monthly distances: {monthly_distances}")
            
            db.close_con()
            return self.calc_emissions_savings(monthly_distances)

        else:

            db.close_con()
            return None

        


    def calc_emissions(self, distance: float, vehicle_type: str) -> float:
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


    def calc_scores(self, emissions_difference: float) -> float:
        if emissions_difference < 0:
            return -1

        return round(emissions_difference / 1000, 2)


    def calc_emissions_savings(self, monthly_distances):
        emissions_dif = {
            "bike": 0,
            "luas": 0,
            "train": 0,
            "bus": 0,
            "walk": 0,
        }

        for vehicle_type in self.vehicle_types:
            if vehicle_type == "car" or vehicle_type == "total" or vehicle_type == "username":
                continue

            if vehicle_type not in monthly_distances:
                self.logger.error(f"Key '{vehicle_type}' not found in monthly_distances")
                continue
            
            # self.logger.log(msg=f"current vehicle type: {vehicle_type}")
            print(f"current vehicle type: {vehicle_type}")

            car_emissions = self.calc_emissions(
                monthly_distances[vehicle_type], "car"
            )
            transport_emissions = self.calc_emissions(
                monthly_distances[vehicle_type], vehicle_type
            )

            emissions_dif[vehicle_type] = car_emissions - transport_emissions

        return emissions_dif