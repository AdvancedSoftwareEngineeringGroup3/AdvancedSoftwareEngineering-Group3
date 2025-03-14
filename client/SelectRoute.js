import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import {
  decodeRoute,
  getCurrentLocation,
  startLocationTracking,
} from './mapUtils';
import locationCircleIcon from './assets/location-circle.png';

export default function SelectRouteScreen({ navigation, route }) {
  const { origin, destination, routeData } = route.params;
  const [routes, setRoutes] = useState([]);
  const [location, setLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [polylineCoordinates, setPolylineCoordinates] = useState([]);
  const [currentRoute, setCurrentRoute] = useState(routeData.routes[0]);

  // Get current location
  useEffect(() => {
    (async () => {
      try {
        const initialLocation = await getCurrentLocation();
        setLocation(initialLocation);
        console.log(location);

        const locationSubscription = await startLocationTracking(setLocation);

        return () => locationSubscription.remove();
      } catch (error) {
        setErrorMessage(error.message);
        return null;
      }
    })();
  }, [location]);

  // Generate polyline
  // Decode and set polyline coordinates
  useEffect(() => {
    if (routeData && routeData.routes && routeData.routes.length > 0) {
      const encodedPolyline = currentRoute.overview_polyline.points;
      const decodedPath = decodeRoute(encodedPolyline); // Decode into lat/lng pairs
      // if this mode is driving, call the speedlimit api, passing decodedPath
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
    console.log(`origin: ${origin}destination: ${destination}`);
  };

  return (
    <View style={styles.containter}>
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      {!errorMessage && location && (
        <>
          <MapView
            style={styles.map}
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
            {routes.map((routeOption, index) => {
              const uniquekey = `${routeOption.summary}-${routeOption.overview_polyline.points}`;
              return (
                <View key={uniquekey} style={styles.routeContainer}>
                  <TouchableOpacity
                    onPress={() => displaySelectedRoute(index)}
                    style={styles.routeButton}
                  >
                    <Text>Route {index + 1}</Text>
                    <Text>Distance: {routeOption.legs[0].distance.text}</Text>
                    <Text>Duration: {routeOption.legs[0].duration.text}</Text>
                  </TouchableOpacity>
                  {/* routeData needs to rename the route variable because that is what react navigator calls its properties */}
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('DisplayRouteScreen', {
                        origin,
                        destination,
                        routeData: routeOption,
                        polylineCoordinates,
                      })
                    }
                    style={styles.startButton}
                  >
                    <Text>Start Journey</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </>
      )}
      {!errorMessage && !location && (
        <Text style={styles.loadingText}>Loading...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  routeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  routeButton: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  startButton: {
    padding: 10,
    backgroundColor: '#ADD8E6',
    borderRadius: 5,
  },
  error: { color: 'red', textAlign: 'center', margin: 10 },
  loadingText: { textAlign: 'center', margin: 10 },
});
