from base_api import BaseAPI
import requests
import json
import time
import datetime

# URL of Open Data
APIKEY = '3386ce10aca77dde762ab5c2de0177f7405cb6b3'

class bikeAPI(BaseAPI):

    def __init__(self):
        super().__init__()

    def get(self, apiKey):
        # URL of Open Data
        self.apiKey = apiKey
        self.url = 'https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey=' + APIKEY

        self.response = requests.get(self.url)

        # Check if the request was successful
        if self.response.status_code == 200:
            for item in self.response.json():
                print(item['name'], ' ', item['available_bikes'], (int(item['last_update'])))

        else:
            print("Failed to retrieve data:", self.response.status_code)

    

bike = bikeAPI()
bike.get(APIKEY)