from enum import Enum
import logging
from fastapi import Query, HTTPException, APIRouter
from dotenv import load_dotenv
from .Database_class import DataBase

router = APIRouter()


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

    def db_initialise_sustainability(self, username):
        db = DataBase()
        db.connect_db()

        # Monthly distances table
        current_month_distances_dict = {
            "username": username,
            "bike": 0,
            "car": 0,
            "luas": 0,
            "train": 0,
            "bus": 0,
            "walk": 0,
            "total": 0,
        }

        db.add_entry("monthly_distance", current_month_distances_dict)
        self.logger.info("User entry added to current month distances")

        # Current year emissions table

        year_emissions_dict = {
            "username": username,
            "month_1": 0,
            "month_2": 0,
            "month_3": 0,
            "month_4": 0,
            "month_5": 0,
            "month_6": 0,
            "month_7": 0,
            "month_8": 0,
            "month_9": 0,
            "month_10": 0,
            "month_11": 0,
            "month_12": 0,
        }

        db.add_entry("monthly_emissions_2025", year_emissions_dict)
        self.logger.info("User entry added to monthly emissions table")

        db.close_con()

    def api_get_sus_stats(self):
        @self.app.get("/get_sus_stats")
        async def get_sus_stats(user: str = Query(..., alias="sender")):
            self.logger.info(
                f"Received request for sustainability statistics from {user}"
            )
            emissions_savings = self.db_fetch_month_sus_stats(user)
            current_year_emissions = self.db_fetch_year_sus_stats(user)
            raw_distances = self.db_fetch_raw_distances(user)
            friends_sus_scores = self.db_get_friends_sust_scores(user)

            self.logger.info(f"Emissions savings: {emissions_savings}")
            self.logger.info(f"Year emissions: {current_year_emissions}")
            self.logger.info(f"Raw distances: {raw_distances}")
            self.logger.info(
                f"Sustainability scores of friends: {friends_sus_scores}"
            )

            if emissions_savings is None or current_year_emissions is None:
                raise HTTPException(
                    status_code=404, detail=f"User '{user}' not found"
                )

            self.logger.info("Sustainability stats retrieved")

            # Return emissions_savings as JSON
            return {
                "emissions_savings": emissions_savings,
                "current_year_emissions": current_year_emissions,
                "raw_distances": raw_distances,
                "friends_sus_scores": friends_sus_scores,
            }

    def db_fetch_month_sus_stats(self, user):
        table_name = "monthly_distance"
        db = DataBase()
        db.connect_db()

        if db.search_user(table_name, user):
            monthly_distances = db.return_user_row(table_name, user)
            db.close_con()
            return self.calc_emissions_savings(monthly_distances)

        else:
            db.close_con()
            return None

    def db_fetch_year_sus_stats(self, user):
        table_name = "monthly_emissions_2025"
        db = DataBase()
        db.connect_db()

        # If user found
        if db.search_user(table_name, user):
            self.logger.info("Found user")
            current_year_emissions = db.return_user_row(table_name, user)
            current_year_emissions.pop(
                "username", None
            )  # Remove the username key if it exists

            self.logger.info("Current year emissions retrieved")
            self.logger.info(
                f"Current year emissions: {current_year_emissions}"
            )
            db.close_con()

            return current_year_emissions

        else:
            db.close_con()
            print("Year stats not found")
            return None

    def db_update_monthly_distances(self, user, journey_data):
        table_name = "monthly_distance"
        db = DataBase()
        db.connect_db()

        # If user found
        if db.search_user(table_name, user):
            self.logger.info("Found user")
            for transport_mode in journey_data:
                if transport_mode not in self.vehicle_types:
                    self.logger.error(
                        f"Invalid transport mode: {transport_mode}"
                    )
                    continue

                # Get distance for each transport mode
                raw_distances = db.return_user_row(table_name, user)
                self.logger.info(f"Raw distances: {raw_distances}")
                # Add new distances to the existing ones
                journey_data[transport_mode] += raw_distances[transport_mode]
                self.logger.info(f"Updated distances: {journey_data[transport_mode]}")
                # Update the database with new distances
                db.update_entry(
                    table_name, user, transport_mode, journey_data[transport_mode]
                )
            db.close_con()
            return True

        else:
            db.close_con()
            print("Monthly distances not found")
            return False


    def db_fetch_raw_distances(self, user):
        table_name = "monthly_distance"
        db = DataBase()
        db.connect_db()

        # If user found
        if db.search_user(table_name, user):
            self.logger.info("Found user")
            monthly_distances = db.return_user_row(table_name, user)
            self.logger.info(f"monthly distances: {monthly_distances}")
            db.close_con()
            return monthly_distances

        else:
            db.close_con()
            print("Year stats not found")
            return None

    def db_fetch_all_sust_friends(self, user):
        table_name = "user_table"
        db = DataBase()
        db.connect_db()
        friends_list = db.search_entry(table_name, user, "friends_list")
        db.close_con()
        return friends_list

    def db_get_friends_sust_scores(self, user):
        table_name = "user_table"
        db = DataBase()
        db.connect_db()
        friends_list = self.db_fetch_all_sust_friends(user)

        if isinstance(friends_list, tuple):
            friends_list = list(friends_list)

        # Check for no friends
        if not friends_list:  # This handles both None and empty lists
            self.logger.info(f"Friends list empty for: {user}")
            friends_list = [
                user
            ]  # Create a list with the user as the only entry
        else:
            friends_list.append(user)  # Append the user to the existing list

        friend_scores = {}
        for friend in friends_list:
            query = f"SELECT sus_score FROM {table_name} WHERE username = '{friend}';"  # noqa: E501
            cursor = db.connection.cursor()
            try:
                cursor.execute(query)
                result = cursor.fetchone()
                if result:
                    friend_scores[friend] = result[0]
                else:
                    friend_scores[friend] = None
            except Exception as e:
                self.logger.error(
                    f"Error fetching sustainability score for {friend}: {e}"
                )
                friend_scores[friend] = None
            finally:
                cursor.close()

        db.close_con()
        return friend_scores

    def calc_emissions(self, distance: float, vehicle_type: str) -> float:
        """
        EF = E/A # EF => E = A * EF = emmisiions factor, E = total emissions,
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
        elif vehicle_type == "bike":
            emission_factor = 0
        elif vehicle_type == "walk":
            emission_factor = 0
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
            if (
                vehicle_type == "car"
                or vehicle_type == "total"
                or vehicle_type == "username"
            ):
                continue

            if vehicle_type not in monthly_distances:
                self.logger.error(
                    f"Key '{vehicle_type}' not found in monthly_distances"
                )
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
