import requests
from xml.dom.minidom import parseString
import time
import datetime
import xml.etree.ElementTree as ET

class luasAPI:

    def __init__(self):
        pass

    def get(self, stop):
        # URL of Open Data
        self.stop = stop
        self.url = f'http://luasforecasts.rpa.ie/xml/get.ashx?action=forecast&stop={self.stop}&encrypt=false'

        # poll_interval = 10

        # while True:
        #     # Fetch the geoJSON data from the URL
        #     response = requests.get(url)

        #     # Check if the request was successful
        #     if response.status_code == 200:
        #         for item in response.json():
        #             print(item['name'], ' ', item['available_bikes'], (int(item['last_update'])))

        #     else:
        #         print("Failed to retrieve data:", response.status_code)

        #     time.sleep(poll_interval)

        #while True:
        # fetch the real-time Luas data from the URL
        self.response = requests.get(self.url)

        # check if the request was succesful
        if self.response.status_code == 200:
            # parse xml content
            root = ET.fromstring(self.response.content)

            # initialise dictionaries to store tram info by direction
            tram_info = {"Inbound": [], "Outbound": []}

            # iterate through each direction
            for direction in root.findall('direction'):
                direction_name = direction.get('name')
                for tram in direction.findall('tram'):
                    due_mins = tram.get('dueMins')
                    destination = tram.get('destination')
                    tram_info[direction_name].append({"dueMins": due_mins, "destination": destination})

            # print the extracted tram information
            print("Inbound Trams:", tram_info["Inbound"])
            print("Outbound Trams:", tram_info["Outbound"])

luas = luasAPI()
luas.get('ran')