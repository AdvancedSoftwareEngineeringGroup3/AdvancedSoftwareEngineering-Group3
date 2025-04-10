/* eslint-disable no-undef, no-use-before-define, react-hooks/exhaustive-deps, array-callback-return */

import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Alert, TouchableOpacity, Switch } from 'react-native';
import * as Speech from 'expo-speech';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { haversine, startLocationTracking } from './utils/mapUtils';
import displayRouteStyles from './components/styles/DisplayRoute.styles';

import locationCircleIcon from './assets/location-circle.png';

export default function DisplayRouteScreen({ navigation, route }) {
  // route is a prop passed by the navigator, hence why that is used instead of other variable names
  const { origin, destination, routeData, polylineCoordinates } = route.params;
  const [location, setLocation] = useState(null);
  const [travelledPolyline, setTravelledPolyline] = useState([]);
  const [remainingPolyline, setRemainingPolyline] =
    useState(polylineCoordinates);
  const [devMode, setDevMode] = useState(false);
  const [audioOn, setAudioOn] = useState(false);
  const [detailedStepData, setDetailedStepData] = useState([]);
  const [currentInstruction, setCurrentInstruction] = useState(null);

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
    if(instruction) {
      return instruction.replace(/<\/?[^>]+(>|$)/g, '');
    } else {
      return instruction
    }
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
            // TODO: maybe navigate to sustainability
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
          <View style={displayRouteStyles.infoContainer}>
            <View style={displayRouteStyles.routeInfoContainer}>
              {currentInstruction != null ? (
                <Text style={displayRouteStyles.routeInfo}>
                  {currentInstruction}
                </Text>
              ) : (
                <>
                  <Text style={displayRouteStyles.routeInfo}>
                    Route from {origin} to {destination}
                  </Text>
                  <Text style={displayRouteStyles.routeInfo}>
                    Distance: {routeData.legs[0].distance.text}
                  </Text>
                  <Text style={displayRouteStyles.routeInfo}>
                    Duration: {routeData.legs[0].duration.text}
                  </Text>
                </>
              )}
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
    </View>
  );
}
