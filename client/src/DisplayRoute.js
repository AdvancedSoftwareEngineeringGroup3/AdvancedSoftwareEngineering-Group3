import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Alert, TouchableOpacity, Switch, Image, } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { haversine, startLocationTracking } from './utils/mapUtils';
import displayRouteStyles from './components/styles/DisplayRoute.styles';
import { Platform } from 'react-native';
import locationCircleIcon from './assets/location-circle.png';
import IncidentReporter from './IncidentReporter';
import { postIncident } from './utils/incidentReporterUtils';
import accident from './assets/Crowdsource/TrafficAccident.png';
import roadClosure from './assets/Crowdsource/RoadClosure.png';
import roadHazard from './assets/Crowdsource/hazard.png';
import police from './assets/Crowdsource/Speeding.png';
import trafficJam from './assets/Crowdsource/TrafficSlow.png';
import construction from './assets/Crowdsource/construction.png';


const iconMap = {
  'Accident': accident,
  'Closure': roadClosure,
  'Hazard': roadHazard,
  'Police': police,
  'Traffic': trafficJam,
  'Construction': construction,
};



export default function DisplayRouteScreen({ navigation, route }) {
  // route is a prop passed by the navigator, hence why that is used instead of other variable names
  const { origin, destination, routeData, polylineCoordinates } = route.params;
  const [location, setLocation] = useState(null);
  const [travelledPolyline, setTravelledPolyline] = useState([]);
  const [currentPolylineIndex, setCurrentPolylineIndex] = useState(0);
  const [devMode, setDevMode] = useState(false);
  const [incidentInfo, setIncidentInfo] = useState([]);

  const handleIncidentSubmit = async (incidentData) => {
    // Here you would process the incident data
    console.log('Incident reported:', incidentData);

    // Example: Send to your API
    const data = await postIncident(incidentData);
    console.log('Response:', data);

    // Example: Update local state to show on map
    // setMapIncidents(prev => [...prev, incidentData]);
  };

  const pollIncident = async () => {
    try {
      const baseUrl =
        Platform.OS === 'web'
          ? 'http://localhost:8000'
          : process.env.EXPO_PUBLIC_API_URL;
      console.log(
        `Sending request to ${baseUrl}/check_incidents`,
      );

      const response = await fetch(`${baseUrl}/check_incidents`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      // Check if the response is ok
      if (response.ok) {
        // Parse the response as JSON
        const serverMessage = await response.json();
        console.log('Response from Server: ', serverMessage.message);

        // process the return incidents object, which contains multiple incidents
        setIncidentInfo(serverMessage.message)

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

  // Poll for incidents every 5 seconds
    useEffect(() => {
      const intervalId = setInterval(() => {
        pollIncident();
      }, 5000); // Poll every 5 seconds
  
      // Cleanup function to clear the interval when the component unmounts
      return () => clearInterval(intervalId);
    }, []);

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
            {Array.isArray(incidentInfo) &&
                incidentInfo.map((incident, index) => {
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
