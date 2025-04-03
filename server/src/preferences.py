import logging
from fastapi import Body
from dotenv import load_dotenv
from pydantic import BaseModel
from src.Database_class import DataBase


class Preferences:
    def __init__(self, api, logger: logging.Logger):

        self.app = api
        self.logger = logger
        load_dotenv()

        self.set_Preferences()

    def set_Preferences(
        self,
    ): 
        @self.app.post("/setPreferences")
        async def set_Preferences(request: userPersonalizedSettings):
            self.logger.info("Received user personalized settings:")
            self.db_handle_preferences(request)
            return {"message": "Successfully saved user preferences"}      
            
    def db_handle_preferences(self, request):
        db = DataBase()
        db.connect_db()
        db.add_entry(
            "user_personalized_settings", request.request_into_dictionary()
        )
        self.logger.info("User preferences saved to database")
        db.close_con()
        
    def db_get_preferences(self, username):
        db = DataBase()
        db.connect_db()
        motorwayPref = db.search_entry("user_personalized_settings", username, 'motorways')
        tollsPref = db.search_entry("user_personalized_settings", username, 'tolls')
        self.logger.info("User preferences retrieved from database")
        print("preferences retrieved from db", motorwayPref, tollsPref)
        db.close_con()
        return {    
            "motorways": motorwayPref,
            "tolls": tollsPref,
        }
    


class userPersonalizedSettings(BaseModel):
    username: str = Body(...)
    bike: bool = Body(...)
    privateVehicle: bool = Body(...)
    accessibility: bool = Body(...)
    motorways: bool = Body(...)
    tolls: bool = Body(...)
    bus: bool = Body(...)
    car: bool = Body(...)
    train: bool = Body(...)
    walk: bool = Body(...)
    tram: bool = Body(...)
    personalBike: bool = Body(...)

    def request_into_dictionary(self):
        return {
            "username": self.username, 
            "bike": self.bike,
            "private_vehicle": self.privateVehicle,
            "accessibility": self.accessibility,
            "motorways": self.motorways,
            "tolls": self.tolls,
            "bus": self.bus,
            "car": self.car,
            "train": self.train,
            "walk": self.walk,
            "tram": self.tram,
            "personal_bike": self.personalBike,
        }
