import requests
import numpy as np

long = '-6.266155'
lat = '53.350140'
url = 'https://api.open-meteo.com/v1/forecast?latitude='+ lat +'&longitude='+ long +'&hourly=temperature_2m,apparent_temperature,precipitation,rain,snowfall,cloud_cover,wind_speed_10m&forecast_days=1&models=ecmwf_ifs025';

# Fetch the geoJSON data from the URL
response = requests.get(url)

# Check if the request was successful
if response.status_code == 200:
    data = response.json()['hourly']
    weather = np.column_stack((data['time'], data['temperature_2m'], data['apparent_temperature'], data['precipitation'], data['rain'], data['snowfall'], data['cloud_cover'], data['wind_speed_10m'] ))
    print(weather)

else:
    print("Failed to retrieve data:", response.status_code)

