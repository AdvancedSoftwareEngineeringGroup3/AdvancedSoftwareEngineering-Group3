import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getCurrentLocation, startLocationTracking } from './utils/mapUtils';
import MapStyles from './components/styles/Map.styles';

import Sunny from './assets/MapDashboard/SunIcon.png';
import Rain from './assets/MapDashboard/rainIcon.png';
import Cloud from './assets/MapDashboard/CloudIcon.png';
import Thunder from './assets/MapDashboard/lightingIcon.png';
import accident from './assets/Crowdsource/TrafficAccident.png';
import roadClosure from './assets/Crowdsource/RoadClosure.png';
import roadHazard from './assets/Crowdsource/hazard.png';
import police from './assets/Crowdsource/Speeding.png';
import trafficJam from './assets/Crowdsource/TrafficSlow.png';
import construction from './assets/Crowdsource/construction.png';

const iconMap = {
  Accident: accident,
  Closure: roadClosure,
  Hazard: roadHazard,
  Police: police,
  Traffic: trafficJam,
  Construction: construction,
};

export default function MapScreen({ navigation }) {
  const [bikeStations, setBikeStations] = useState([]);
  const [incidentInfo, setIncidentInfo] = useState([]);
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const mapRef = useRef(null);
  const [pollingFlag, setPollingFlag] = useState(false);

  const pollIncident = async () => {
    try {
      const baseUrl =
        Platform.OS === 'web'
          ? 'http://localhost'
          : process.env.EXPO_PUBLIC_API_URL;
      console.log(`Sending request to ${baseUrl}/check_incidents`);

      const response = await fetch(`${baseUrl}/check_incidents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Check if the response is ok
      if (response.ok) {
        // Parse the response as JSON
        const serverMessage = await response.json();
        console.log('Response from Server: ', serverMessage.message);

        // process the return incidents object, which contains multiple incidents
        setIncidentInfo(serverMessage.message);
      } else {
        // Log the raw response text for debugging
        const responseText = await response.text();
        console.error('Failed to get crowd sourced incidents:', responseText);
        alert('Server Error: ', responseText);
      }
    } catch (error) {
      console.error('Error getting crowd sourced incidents:', error);
    }
  };

  // choose weather Icon
  const getWeatherIcon = (weatherCondition) => {
    switch (weatherCondition) {
      case 'sun':
        return Sunny;
      case 'cloud':
        return Cloud;
      case 'rain':
        return Rain;
      case 'thunder':
        return Thunder;
      default:
        return null;
    }
  };

  const fetchWeather = async (initialLocation) => {
    try {
      const baseUrl =
        Platform.OS === 'web'
          ? 'http://localhost'
          : process.env.EXPO_PUBLIC_API_URL;

      console.log(
        `Sending request to ${baseUrl}/weather?longitude=${initialLocation.longitude}&latitude=${initialLocation.latitude}`,
      );

      const response = await fetch(
        `${baseUrl}/weather?longitude=${initialLocation.longitude}&latitude=${initialLocation.latitude}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.ok) {
        const serverMessage = await response.json();
        console.log('Response from Server: ', serverMessage.weather);
        console.log('Response from Server: ', serverMessage.temperature);
        setWeather(serverMessage.weather);
        setTemperature(serverMessage.temperature);
      } else {
        const responseText = await response.text();
        console.error('Failed to get weather:', responseText);
        setWeather('cloud'); // fallback
        setTemperature('10');
      }
    } catch (error) {
      console.error('Error getting real time weather', error);
      setWeather('cloud'); // fallback on network error
      setTemperature('10');
    }
  };

  const fetchBikeApi = async (initialLocation) => {
    try {
      const baseUrl =
        Platform.OS === 'web'
          ? 'http://localhost'
          : process.env.EXPO_PUBLIC_API_URL;

      console.log(
        `Sending request to ${baseUrl}/BikeStand?longitude=${initialLocation.longitude}&latitude=${initialLocation.latitude}`,
      );

      const response = await fetch(
        `${baseUrl}/BikeStand?longitude=${initialLocation.longitude}&latitude=${initialLocation.latitude}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const raw = await response.text();
      console.log('Raw Bike API Response:', raw);

      const serverMessage = raw ? JSON.parse(raw) : null;

      if (serverMessage && Array.isArray(serverMessage.BikeInfo)) {
        setBikeStations(serverMessage.BikeInfo);
      } else if (Array.isArray(serverMessage)) {
        // if it's just a raw array
        setBikeStations(serverMessage);
      } else {
        console.warn('Unexpected or null response, setting empty bikeStations');
        setBikeStations([]);
      }
    } catch (error) {
      console.error('Error fetching bike station data:', error);
      setBikeStations([]); // fallback
    }
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const initialLocation = await getCurrentLocation();
        setLocation(initialLocation);
        // weatherBikePollIncident(initialLocation);

        fetchWeather(initialLocation);
        fetchBikeApi(initialLocation);
        pollIncident();

        const locationSubscription = await startLocationTracking(setLocation);

        return () => locationSubscription.remove();
      } catch (error) {
        setErrorMessage(error.message);
        return () => {};
      }
    };
    fetchLocation();
  }, []);

  const weatherBikePollIncident = async (initialLocation) => {
    // await new Promise((resolve) => setTimeout(resolve, 15000));
    console.log('initial location: ', initialLocation);
    if (initialLocation && location) {
      fetchWeather(initialLocation);
      fetchBikeApi(initialLocation);
      pollIncident();
    }
  };

  const renderContent = () => {
    if (errorMessage) {
      return <Text style={MapStyles.error}>{errorMessage}</Text>;
    }

    if (location) {
      const weatherIcon = getWeatherIcon(weather);
      return (
        <>
          {weatherIcon && (
            <View style={MapStyles.weatherContainer}>
              <Image
                source={weatherIcon}
                style={MapStyles.weatherIcon}
                resizeMode="contain"
              />
              <Text style={MapStyles.weatherText}>{temperature}°C</Text>
            </View>
          )}

          <MapView
            ref={mapRef}
            style={MapStyles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {Array.isArray(bikeStations) &&
              bikeStations.map((station) => (
                <Marker
                  key={station.number}
                  coordinate={{
                    latitude: station.position.lat,
                    longitude: station.position.lng,
                  }}
                  title={station.name}
                  description={`Available Bikes: ${station.available_bikes}`}
                >
                  <Image
                    // eslint-disable-next-line global-require
                    source={require('./assets/MapDashboard/bikeicon.png')}
                    style={{ width: 40, height: 40 }}
                    resizeMode="contain"
                  />
                </Marker>
              ))}

            {Array.isArray(incidentInfo) &&
              incidentInfo.map((incident) => {
                const type = incident[2]; // Adjust this if the incident type is in a different index
                const icon = iconMap[type] || accident; // default fallback icon

                return (
                  <Marker
                    key={incident[0]}
                    coordinate={{
                      latitude: parseFloat(incident[5]),
                      longitude: parseFloat(incident[6]),
                    }}
                    title={incident[2]}
                    description={incident[3]}
                  >
                    <Image
                      source={icon}
                      style={{ width: 40, height: 40 }}
                      resizeMode="contain"
                    />
                  </Marker>
                );
              })}

            <Marker
              coordinate={location}
              title="Your Location"
              description="Real-time location"
            >
              <Image
                // eslint-disable-next-line global-require
                source={require('./assets/location-circle.png')}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />
            </Marker>
          </MapView>

          <TouchableOpacity
            style={MapStyles.loginButton}
            onPress={() => navigation.navigate('AccountScreen')}
          >
            <Text style={MapStyles.buttonText}>Account</Text>
          </TouchableOpacity>

          <View style={MapStyles.bar}>
            <Image
              // eslint-disable-next-line global-require
              source={require('./assets/MapDashboard/movementbar.png')}
              style={MapStyles.barImage}
              resizeMode="contain"
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('Dashboard')}
              style={MapStyles.button}
            >
              <Image
                // eslint-disable-next-line global-require
                source={require('./assets/MapDashboard/leaficon.png')}
                style={MapStyles.icon}
              />
              <Text style={MapStyles.label}>Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('FindRouteScreen')}
              style={[MapStyles.button, MapStyles.centerButton]}
            >
              <Image
                // eslint-disable-next-line global-require
                source={require('./assets/MapDashboard/routeicon.png')}
                style={[MapStyles.icon, MapStyles.centerIcon]}
              />
              <Text style={MapStyles.label}>Find Route</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('FriendsScreen')}
              style={MapStyles.button}
            >
              <Image
                // eslint-disable-next-line global-require
                source={require('./assets/MapDashboard/friendsicon.png')}
                style={MapStyles.icon}
              />
              <Text style={MapStyles.label}>Friends</Text>
            </TouchableOpacity>
          </View>
        </>
      );
    }

    return <Text style={MapStyles.loadingText}>Fetching your location...</Text>;
  };

  return <View style={MapStyles.container}>{renderContent()}</View>;
}
