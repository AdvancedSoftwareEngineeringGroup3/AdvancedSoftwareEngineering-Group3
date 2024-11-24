import requests
import json
import time
import datetime

# URL of Open Data
APIKEY = '3386ce10aca77dde762ab5c2de0177f7405cb6b3'
url = 'https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey=' + APIKEY

poll_interval = 10

while True:
    # Fetch the geoJSON data from the URL
    response = requests.get(url)

    # Check if the request was successful
    if response.status_code == 200:
        for item in response.json():
            print(item['name'], ' ', item['available_bikes'], (int(item['last_update'])))

    else:
        print("Failed to retrieve data:", response.status_code)

    time.sleep(poll_interval)
