import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import {
  decodeRoute,
  getCurrentLocation,
  startLocationTracking,
} from './utils/mapUtils';
import locationCircleIcon from './assets/location-circle.png';
import selectRouteStyles from './components/styles/SelectRoute.styles';
import { retrieveData } from './caching';

export default function SelectRouteScreen({ navigation, route }) {
  const {origin, destination, routeData } = route.params;
  const [routes, setRoutes] = useState([]);
  const [location, setLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [polylineCoordinates, setPolylineCoordinates] = useState([]);
  const [currentRoute, setCurrentRoute] = useState(routeData.routes[0]);
  const [scores, setScores] = useState([]);


  // Get current location
  useEffect(() => {
    (async () => {
      try {
        const initialLocation = await getCurrentLocation();
        setLocation(initialLocation);

        const locationSubscription = await startLocationTracking(setLocation);

        return () => locationSubscription.remove();
      } catch (error) {
        setErrorMessage(error.message);
        return null;
      }
    })();
  }, [location]);

  useEffect(() => {
    for (let i = 0; i < routeData.routes.length; i++) {
      setScores((prevScores) => [
        ...prevScores,
        getSustainabilityScore(i, false),
      ]);
      print (`Sustainability score for route ${i}: ${scores[i]}`);
    }
  }, [routeData.routes]);

  // Generate polyline
  // Decode and set polyline coordinates
  useEffect(() => {
    if (routeData && routeData.routes && routeData.routes.length > 0) {
      const encodedPolyline = currentRoute.overview_polyline.points;
      const decodedPath = decodeRoute(encodedPolyline); // Decode into lat/lng pairs
      setPolylineCoordinates(decodedPath);
      setRoutes(routeData.routes); // Set the routes state
    }
  }, [currentRoute.overview_polyline.points, routeData]);

  // Display all route options
  const displaySelectedRoute = (index) => {
    const selectedRoute = routeData.routes[index];
    setCurrentRoute(selectedRoute);
    const encodedPolyline = selectedRoute.overview_polyline.points;
    const decodedPath = decodeRoute(encodedPolyline); // Decode into lat/lng pairs
    setPolylineCoordinates(decodedPath);
  };

  const getSustainabilityScore = async (index, startRouteFlag) => {
    let sustainabilityScore = {
      "Bus": 0,
      "Train": 0,
      "WALKING": 0,
      "Tram": 0,
      "DRIVING": 0,
      "BICYCLING": 0,
    };
    routeData.routes[index].legs[0].steps.forEach((step) => {
      let key = '';
      if (step.travel_mode === 'TRANSIT') {
        key = step.html_instructions.trim().split(' ')[0]
        console.log("key: ", key);
      }
      else {
        key = step.travel_mode;
      }
      sustainabilityScore[key] += step.distance.value / 1000;
    })
    console.log("sustainability score: ", sustainabilityScore);
    const transportScore = await sendSustainabilityScore(startRouteFlag, sustainabilityScore);
    return transportScore; 
  }

  const sendSustainabilityScore = async (startRouteFlag, sustainabilityScore) => {
    try {
      const baseUrl =
        Platform.OS === 'web'
          ? 'http://localhost:8000'
          : process.env.EXPO_PUBLIC_API_URL;
      console.log(`Sending request to ${baseUrl}/update_sus_stats`);

      const response = await fetch(`${baseUrl}/update_sus_stats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: await retrieveData('username'),
          flag: startRouteFlag ,
          modeDistances: sustainabilityScore,
        }),
      });
      
      let data = await response.json();
      console.log("response (transport score): ", data);
      return data;
    } catch (error) {
      console.log('Error sending sustainability scores and distances:', error);
    };
  }

  const startJourney = (index, routeOption) => {
    getSustainabilityScore(index, true);
    navigation.navigate('DisplayRouteScreen', {
      origin,
      destination,
      routeData: routeOption,
      polylineCoordinates,
    })
  }

    return (
      <View style={selectRouteStyles.container}>
        {errorMessage && (
          <Text style={selectRouteStyles.error}>{errorMessage}</Text>
        )}
        {!errorMessage && location && (
          <>
            <MapView
              style={selectRouteStyles.map}
              initialRegion={{
                latitude:
                  routes.length > 0
                    ? routes[0].legs[0].start_location.lat
                    : location.latitude,
                longitude:
                  routes.length > 0
                    ? routes[0].legs[0].start_location.lng
                    : location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={location}
                title="Your Location"
                description="Real-time location"
                icon={locationCircleIcon}
              />
              {polylineCoordinates.length > 0 && (
                <Marker
                  coordinate={polylineCoordinates[polylineCoordinates.length - 1]}
                  title="Destination"
                  description="Destination of the route"
                />
              )}
              {polylineCoordinates.length > 0 && (
                <Polyline
                  coordinates={polylineCoordinates}
                  strokeColor="#1063D5"
                  strokeWidth={4}
                />
              )}
            </MapView>
            <View>
              {routes.map((routeOption, index) => (
                <View
                  key={index} // eslint-disable-line react/no-array-index-key
                  style={selectRouteStyles.routeContainer}
                >
                  <TouchableOpacity
                    onPress={() => displaySelectedRoute(index)}
                    style={selectRouteStyles.routeButton}
                  >
                    <Text>Route {index + 1}</Text>
                    <Text>Distance: {routeOption.legs[0].distance.text}</Text>
                    <Text>Duration: {routeOption.legs[0].duration.text}</Text>
                    <Text>Sustainability score: {scores[index]}</Text>
                  </TouchableOpacity>
                  {/* routeData needs to rename the route variable because that is what react navigator calls its properties */}
                  <TouchableOpacity
                    onPress={() => {startJourney(index, routeOption)}}
                    style={selectRouteStyles.startButton}
                  >
                    <Text>Start Journey</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}
        {!errorMessage && !location && (
          <Text style={selectRouteStyles.loadingText}>Loading...</Text>
        )}
      </View>
    );
  }
