import requests
import math

# URL of Open Data
APIKEY = "3386ce10aca77dde762ab5c2de0177f7405cb6b3"


class bikeAPI:

    def __init__(self):
        super().__init__()

    def get(self, lat=53.349562, lng=-6.278198):
        # URL of Open Data
        self.apiKey = APIKEY
        self.url = (
            "https://api.jcdecaux.com/vls/v1/stations?contract=dublin&apiKey="
            + APIKEY
        )

        self.response = requests.get(self.url)
        # count = 0
        loadedBikestops = []
        # Check if the request was successful
        if self.response.status_code == 200:
            for item in self.response.json():
                # print(item['position']['lat'])
                within_walking = self.are_coordinates_within_distance(
                    float(item["position"]["lat"]),
                    float(item["position"]["lng"]),
                    lat,
                    lng,
                    0.5,
                )
                if within_walking:
                    loadedBikestops.append(item)

            # print(loadedBikestops)
            return loadedBikestops
        else:
            print("Failed to retrieve data:", self.response.status_code)

    def are_coordinates_within_distance(
        self, lat1, lon1, lat2, lon2, max_distance_km=5
    ):
        """
        Determine if two GPS coordinates are within
        a specified distance (default 5 km).

        Uses the Haversine formula to calculate
        the great-circle distance between two points.

        Parameters:
        lat1, lon1: Latitude and longitude of first point in decimal degrees
        lat2, lon2: Latitude and longitude of second point in decimal degrees
        max_distance_km: Maximum distance in kilometers (default 5)

        Returns:
        Boolean: True if points are within the specified distance,
        False otherwise
        """
        # Convert decimal degrees to radians
        lat1_rad = math.radians(lat1)
        lon1_rad = math.radians(lon1)
        lat2_rad = math.radians(float(lat2))
        lon2_rad = math.radians(float(lon2))

        # Radius of the Earth in kilometers
        earth_radius = 6371.0

        # Haversine formula
        dlon = lon2_rad - lon1_rad
        dlat = lat2_rad - lat1_rad

        a = (
            math.sin(dlat / 2) ** 2
            + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2) ** 2
        )
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        distance = earth_radius * c

        return distance <= max_distance_km
