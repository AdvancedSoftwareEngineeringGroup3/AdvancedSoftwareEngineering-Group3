import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Alert, TouchableOpacity, Switch } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { haversine, startLocationTracking } from './utils/mapUtils';
import displayRouteStyles from './components/styles/DisplayRoute.styles';

import IncidentReporter from './IncidentReporter';

import locationCircleIcon from './assets/location-circle.png';

export default function DisplayRouteScreen({ navigation, route }) {
  // route is a prop passed by the navigator, hence why that is used instead of other variable names
  const { origin, destination, routeData, polylineCoordinates } = route.params;
  const [location, setLocation] = useState(null);
  const [travelledPolyline, setTravelledPolyline] = useState([]);
  const [currentPolylineIndex, setCurrentPolylineIndex] = useState(0);
  const [devMode, setDevMode] = useState(false);

  const handleIncidentSubmit = (incidentData) => {
    // Here you would process the incident data
    console.log('Incident reported:', incidentData);

    // Example: Send to your API
    // api.reportIncident(incidentData);

    // Example: Update local state to show on map
    // setMapIncidents(prev => [...prev, incidentData]);
  };

  const checkProximityAndUpdate = useCallback(
    (currentLocation) => {
      if (currentPolylineIndex >= polylineCoordinates.length) return;

      const nextCoordinate = polylineCoordinates[currentPolylineIndex];
      const distance = haversine(currentLocation, nextCoordinate);

      if (distance < 50) {
        // Assuming 50 meters as the proximity threshold
        setTravelledPolyline((prev) => [...prev, nextCoordinate]);
        setCurrentPolylineIndex((prev) => prev + 1);
        // setTravelledPolyline([...travelledPolyline, nextCoordinate]);
        // setCurrentPolylineIndex(currentPolylineIndex + 1);

        if (currentPolylineIndex + 1 >= polylineCoordinates.length) {
          Alert.alert(
            'Destination reached',
            'You have reached your destination.',
          );
          navigation.navigate('Map');
        }
      }
    },
    [currentPolylineIndex, polylineCoordinates, navigation],
  );

  useEffect(() => {
    if (devMode) {
      // Set initial location to the first coordinate in the polyline
      setLocation(polylineCoordinates[0]);
    }
    // Start tracking location
    const startTracking = async () => {
      try {
        await startLocationTracking((currentLocation) => {
          if (!devMode) {
            setLocation(currentLocation);
          }
          checkProximityAndUpdate(currentLocation);
        });
      } catch (error) {
        console.error('Error starting location tracking:', error);
      }
    };

    startTracking();
  }, [devMode, polylineCoordinates, checkProximityAndUpdate]);

  // Call checkProximityAndUpdate and update setlocation on latitude / longitude button click
  const devMove = ({ delLat = 0, delLng = 0 }) => {
    setLocation({
      latitude: location.latitude + delLat,
      longitude: location.longitude + delLng,
    });
    checkProximityAndUpdate(location);
  };

  // Check proximity to the next coordinate in the polyline

  return (
    <View style={displayRouteStyles.container}>
      {location && routeData ? (
        <>
          <View style={displayRouteStyles.infoContainer}>
            <View style={displayRouteStyles.routeInfoContainer}>
              <Text style={displayRouteStyles.routeInfo}>
                Route from {origin} to {destination}
              </Text>
              <Text style={displayRouteStyles.routeInfo}>
                Distance: {routeData.legs[0].distance.text}
              </Text>
              <Text style={displayRouteStyles.routeInfo}>
                Duration: {routeData.legs[0].duration.text}
              </Text>
            </View>
            <View style={displayRouteStyles.devModeContainer}>
              <Text style={displayRouteStyles.devModeText}>Dev Mode</Text>
              <Switch
                value={devMode}
                onValueChange={(value) => setDevMode(value)}
              />
            </View>
          </View>
          <MapView
            style={displayRouteStyles.map}
            initialRegion={{
              latitude: routeData.legs[0].start_location.lat,
              longitude: routeData.legs[0].start_location.lng,
              latitudeDelta: 1,
              longitudeDelta: 1,
            }}
          >
            <Marker
              coordinate={location}
              description="Real-time location"
              icon={locationCircleIcon}
            />
            {polylineCoordinates && polylineCoordinates.length > 0 && (
              <Marker
                coordinate={polylineCoordinates[polylineCoordinates.length - 1]}
                title="Destination"
                description="Destination of the route"
              />
            )}
            {polylineCoordinates && polylineCoordinates.length > 0 && (
              <Polyline
                coordinates={polylineCoordinates}
                strokeColor="#1063D5"
                strokeWidth={4}
              />
            )}
            {travelledPolyline.length > 0 && (
              <Polyline
                coordinates={travelledPolyline}
                strokeColor="#ADD8E6"
                strokeWidth={4}
              />
            )}
          </MapView>
          {devMode && (
            <View style={displayRouteStyles.dpadContainer}>
              <TouchableOpacity
                onPress={() => devMove({ delLat: 0.0003 })}
                style={displayRouteStyles.dpadButton}
              >
                <Text>lat +</Text>
              </TouchableOpacity>
              <View style={displayRouteStyles.dpadRow}>
                <TouchableOpacity
                  onPress={() => devMove({ delLng: -0.0004 })}
                  style={displayRouteStyles.dpadButton}
                >
                  <Text>long -</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => devMove({ delLng: 0.0004 })}
                  style={displayRouteStyles.dpadButton}
                >
                  <Text>long +</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => devMove({ delLat: -0.0003 })}
                style={displayRouteStyles.dpadButton}
              >
                <Text>lat -</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <Text style={displayRouteStyles.loadingText}>
          Fetching your location...
        </Text>
      )}

      <IncidentReporter onSubmitIncident={handleIncidentSubmit} />
    </View>
  );
}
