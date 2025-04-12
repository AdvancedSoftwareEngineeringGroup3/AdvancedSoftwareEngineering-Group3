/* eslint-disable no-undef, no-use-before-define, react-hooks/exhaustive-deps, array-callback-return */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  Switch,
  ImageBackground,
  Platform,
  Image,
} from 'react-native';
import * as Speech from 'expo-speech';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { haversine, startLocationTracking } from './utils/mapUtils';
import displayRouteStyles from './components/styles/DisplayRoute.styles';
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
  Accident: accident,
  Closure: roadClosure,
  Hazard: roadHazard,
  Police: police,
  Traffic: trafficJam,
  Construction: construction,
};

export default function DisplayRouteScreen({ navigation, route }) {
  // route is a prop passed by the navigator, hence why that is used instead of other variable names
  const { origin, destination, routeData, polylineCoordinates } = route.params;
  const [location, setLocation] = useState(null);
  const [travelledPolyline, setTravelledPolyline] = useState([]);
  const [remainingPolyline, setRemainingPolyline] =
    useState(polylineCoordinates);
  const [devMode, setDevMode] = useState(false);
  const [audioOn, setAudioOn] = useState(true);
  const [currentInstruction, setCurrentInstruction] = useState(null);
  const [incidentInfo, setIncidentInfo] = useState([]);
  const [detailedStepData, setDetailedStepData] = useState([]);

  const handleIncidentSubmit = async (incidentData) => {
    // Here you would process the incident data
    console.log('Incident reported:', incidentData);

    // Example: Send to your API
    const data = await postIncident(incidentData);
    console.log('Response:', data);

    // Example: Update local state to show on map
    // setMapIncidents(prev => [...prev, incidentData]);
  };

  useEffect(() => {
    setDetailedStepData([]);
    getDetailedStepData();
  }, [routeData]);

  // Check proximity to the next coordinate in the polyline

  useEffect(() => {
    let locationSubscription;
    // Start tracking location
    const startTracking = async () => {
      try {
        locationSubscription = await startLocationTracking(
          (currentLocation) => {
            if (!devMode) {
              setLocation(currentLocation);
              checkProximityAndUpdate(currentLocation);
            }
          },
        );
      } catch (error) {
        console.error('Error starting location tracking:', error);
      }
    };
    if (!devMode) {
      startTracking();
    }
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [devMode, checkProximityAndUpdate]);

  useEffect(() => {
    if (audioOn) {
      Speech.speak(currentInstruction);
    }
  }, [currentInstruction]);

  function removeHtmlTags(instruction) {
    if (instruction) {
      return instruction.replace(/<\/?[^>]+(>|$)/g, '');
    }
    return instruction;
  }

  // Creating a dictionary of step data for each step in the route
  // Pairing locations along with the instructions of each step of the route
  // Using this data to display the instructions on the map as the user moves along the route
  const getDetailedStepData = () => {
    routeData.legs[0].steps.map((step) => {
      // Due to the complicated nature of the response some modes of transport have instructions in outer steps and other in inner
      if (step.travel_mode !== 'TRANSIT' && step.steps) {
        // For non-transit steps within a transit route
        step.steps.forEach((detailedStep) => {
          const temp = detailedStepData;
          temp.push({
            html_instructions: removeHtmlTags(detailedStep.html_instructions),
            start_location: detailedStep.start_location,
          });
          setDetailedStepData(temp);
        });
      } else if (step.travel_mode === 'TRANSIT') {
        // If the step is a transit step, add the arrival stop to the instructions
        const temp = detailedStepData;
        temp.push({
          html_instructions: `${removeHtmlTags(step.html_instructions)} until ${step.transit_details.arrival_stop.name}`,
          start_location: step.start_location,
        });
        setDetailedStepData(temp);
      } else {
        // For non transit routes
        const temp = detailedStepData;
        temp.push({
          html_instructions: removeHtmlTags(step.html_instructions),
          start_location: step.start_location,
        });
        setDetailedStepData(temp);
      }
      return null;
    });
  };

  const isGpsCoordinates = (str) => {
    const gpsRegex = /^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/; // Regex to match "latitude,longitude"
    return gpsRegex.test(str);
  };

  const pollIncident = async () => {
    try {
      const baseUrl =
        Platform.OS === 'web'
          ? 'http://localhost'
          : Constants.expoConfig.extra.EXPO_PUBLIC_API_URL;
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

  const checkProximityAndUpdate = useCallback(
    (currentLocation) => {
      for (let i = 0; i < remainingPolyline.length; i += 1) {
        const distance = haversine(currentLocation, remainingPolyline[i]);

        // Assuming 50 meters as the proximity threshold
        if (distance < 50) {
          setTravelledPolyline((prev) => [
            ...prev,
            ...remainingPolyline.slice(0, i),
          ]);
          setRemainingPolyline((prev) => prev.slice(i));

          if (remainingPolyline.length === 1) {
            Alert.alert(
              'Destination reached',
              'You have reached your destination.',
            );
            navigation.navigate('Map');
          } else {
            // Update instruction if previous instruction complete
            for (let j = 0; j < detailedStepData.length; j += 1) {
              const instructionLocation = {
                latitude: detailedStepData[j].start_location.lat,
                longitude: detailedStepData[j].start_location.lng,
              };
              const instructionDistance = haversine(
                currentLocation,
                instructionLocation,
              );
              if (instructionDistance < 50) {
                setCurrentInstruction(detailedStepData[j].html_instructions);
                setDetailedStepData((prev) => prev.slice(j));
              }
            }
          }
          break;
        }
      }
    },
    [remainingPolyline, navigation, detailedStepData],
  );

  // Poll for incidents every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      pollIncident();
    }, 30000); // Poll every 5 seconds
    pollIncident();
    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // Call checkProximityAndUpdate and update setlocation on latitude / longitude button click
  const devMove = ({ delLat = 0, delLng = 0 }) => {
    const newLocation = {
      latitude: location.latitude + delLat,
      longitude: location.longitude + delLng,
    };

    setLocation(newLocation);
    checkProximityAndUpdate(newLocation);
  };

  const toggleDevMode = (value) => {
    setDevMode(value);
    if (value) {
      // Set initial location to the first coordinate in the polyline
      setLocation(polylineCoordinates[0]);
    }
  };

  return (
    <View style={displayRouteStyles.container}>
      {location && routeData ? (
        <>
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

          <View style={displayRouteStyles.barContainer}>
            <ImageBackground
              // eslint-disable-next-line global-require
              source={require('./assets/MapDashboard/movementbar.png')}
              style={displayRouteStyles.barImage}
              resizeMode="contain"
            >
              {currentInstruction != null ? (
                <View>
                  <Text style={displayRouteStyles.routeInfo}>
                    Route from{' '}
                    {isGpsCoordinates(origin) ? 'current location' : origin} to{' '}
                    {destination}
                  </Text>
                  <Text style={displayRouteStyles.routeInfo}>
                    Distance: {routeData.legs[0].distance.text} Duration:{' '}
                    {routeData.legs[0].duration.text} {'\n \n'}
                    {currentInstruction}
                  </Text>
                </View>
              ) : (
                <>
                  <Text style={displayRouteStyles.routeInfo}>
                    Route from{' '}
                    {isGpsCoordinates(origin) ? 'current location' : origin} to{' '}
                    {destination}
                  </Text>
                  <Text style={displayRouteStyles.routeInfo}>
                    Distance: {routeData.legs[0].distance.text} Duration:{' '}
                    {routeData.legs[0].duration.text}
                  </Text>
                </>
              )}
            </ImageBackground>
          </View>
          <View style={displayRouteStyles.devModeContainer}>
            <Text style={displayRouteStyles.devModeText}>Dev Mode</Text>
            <Switch
              value={devMode}
              onValueChange={(value) => toggleDevMode(value)}
            />
            <Text style={displayRouteStyles.devModeText}>Audio</Text>
            <Switch
              value={audioOn}
              onValueChange={(value) => setAudioOn(value)}
            />
          </View>

          {devMode && (
            <View style={displayRouteStyles.dpadContainer}>
              <TouchableOpacity
                onPress={() => devMove({ delLat: 0.0003 })}
                style={displayRouteStyles.dpadButton}
              >
                <Text style={displayRouteStyles.dpadtext}>lat +</Text>
              </TouchableOpacity>
              <View style={displayRouteStyles.dpadRow}>
                <TouchableOpacity
                  onPress={() => devMove({ delLng: -0.0004 })}
                  style={displayRouteStyles.dpadButton}
                >
                  <Text style={displayRouteStyles.dpadtext}>long -</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => devMove({ delLng: 0.0004 })}
                  style={displayRouteStyles.dpadButton}
                >
                  <Text style={displayRouteStyles.dpadtext}>long +</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => devMove({ delLat: -0.0003 })}
                style={displayRouteStyles.dpadButton}
              >
                <Text style={displayRouteStyles.dpadtext}>lat -</Text>
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
