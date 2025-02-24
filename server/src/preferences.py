import requests
import os
import json
import logging
from fastapi import FastAPI
from fastapi import Query, Body
from dotenv import load_dotenv
from pydantic import BaseModel

class Preferences:
    def __init__(self, api, logger: logging.Logger):
        
        self.app = api
        self.logger = logger
        load_dotenv()

        self.set_Preferences()



    def set_Preferences(self):
        @self.app.post("/setPreferences")
        async def set_Preferences(request: userPersonalizedSettings):
            self.logger.info(
                "Received user personalized settings:"
            )
            print("User personalized preferences object: ", request)
    
    #self.logger.info(f'{"Recieved Personalisation Request"}')
    #try:
        
        #return self.userPersonalisation.post()     
        
        
        
class userPersonalizedSettings(BaseModel):
    walkingSpeed: str
    bike: str
    privateVehicle: str
    accessibility: str
    motorways: str
    tolls: str
    bus: str
    car: str
    train: str
    tram: str
    personalBike: str
    walk: str
