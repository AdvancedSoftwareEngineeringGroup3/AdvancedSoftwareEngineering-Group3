import requests


# from base_api import BaseAPI
# Dublin loc
# long = '-6.266155'
# lat = '53.350140'
class weatherAPI:  # (BaseAPI):
    def __init__(self):
        super().__init__()

        self.who_table = {
            0: "sun",
            1: "cloud",
            2: "cloud",
            3: "cloud",
            45: "cloud",
            48: "cloud",
            51: "rain",
            53: "rain",
            55: "rain",
            56: "rain",
            57: "rain",
            61: "rain",
            63: "rain",
            65: "rain",
            66: "rain",
            67: "rain",
            71: "rain",
            73: "rain",
            75: "rain",
            77: "rain",
            80: "rain",
            81: "rain",
            82: "rain",
            85: "rain",
            86: "rain",
            95: "thunder",
            96: "thunder",
            99: "thunder",
        }

    def get(self, lat, lng):
        self.lat = lat
        self.lng = lng
        self.url = f"https://api.open-meteo.com/v1/forecast?latitude={self.lat}&longitude={self.lng}&current=temperature_2m,weather_code"  # noqa: E501

        # Fetch the geoJSON data from the URL
        response = requests.get(self.url)

        # Check if the request was successful
        if response.status_code == 200:
            data = response.json()["current"]
            # weather = data['weather_code']

            # print(data['temperature_2m'])

            return self.who_table[data["weather_code"]], data["temperature_2m"]

        else:
            print("Failed to retrieve data:", response.status_code)


# To test
w = weatherAPI()
w.get("53.350140", "-6.266155")
