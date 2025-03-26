import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Alert, TouchableOpacity, Switch } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { haversine, startLocationTracking } from './utils/mapUtils';
import displayRouteStyles from './components/styles/DisplayRoute.styles';

import locationCircleIcon from './assets/location-circle.png';

export default function DisplayRouteScreen({ navigation, route }) {
  // route is a prop passed by the navigator, hence why that is used instead of other variable names
  const { origin, destination, routeData, polylineCoordinates } = route.params;
  const [location, setLocation] = useState(null);
  const [travelledPolyline, setTravelledPolyline] = useState([]);
  const [remainingPolyline, setRemainingPolyline] = useState(polylineCoordinates);
  const [devMode, setDevMode] = useState(false);
  const [stepData, setStepData] = useState([]);
  const [innerStepData, setInnerStepData] = useState([]);


  function removeHtmlTags(instruction) {
    return instruction.replace(/<\/?[^>]+(>|$)/g, "");
  }

  // TODO: ADD COMMENTS***
  // rename to indicate polyline
  const getStepData = () => {
    routeData.legs[0].steps.map((step) => {
      let temp = stepData;
      temp.push({
          html_instructions: removeHtmlTags(step.html_instructions),
          start_location: step.start_location,
        });
      setStepData(temp);
    });
  };

  // rename to indicate instructions
  const getInnerStepData = () => {
    routeData.legs[0].steps.map((step) =>{
      if(step.travel_mode !== 'TRANSIT') {
        step.steps.map((innerStep) => {
          let temp = innerStepData;
          temp.push({
            html_instructions: removeHtmlTags(innerStep.html_instructions),
            start_location: innerStep.start_location,
          });
          setInnerStepData(temp);
        })
      }
    });
  };


  const checkProximityAndUpdate = useCallback(
    (currentLocation) => {
      for(let i = 0; i < remainingPolyline.length; i++) {
        const distance = haversine(currentLocation, remainingPolyline[i]);
        
        // Assuming 50 meters as the proximity threshold
        if (distance < 50) {
          setTravelledPolyline((prev) => [...prev, ...remainingPolyline.slice(0, i)]);
          setRemainingPolyline((prev) => prev.slice(i));
          
          if (remainingPolyline.length == 1) {
            Alert.alert(
              'Destination reached',
              'You have reached your destination.',
            );
            //  TODO: maybe navigate to sustainability
            navigation.navigate('Map');
          }
          break;
        }
      }
    },
    [remainingPolyline, navigation],
  );

  useEffect(() => {
    getStepData();
    console.log(stepData);
    getInnerStepData();
    console.log(innerStepData);
  }, []);

  useEffect(() => {
    let locationSubscription;
    // Start tracking location
    const startTracking = async () => {
      try {
        locationSubscription = await startLocationTracking((currentLocation) => {
          if (!devMode) {
            setLocation(currentLocation);
            checkProximityAndUpdate(currentLocation);
          }
        });
      } catch (error) {
        console.error('Error starting location tracking:', error);
      }
    };
    if (!devMode){
      startTracking();
    }
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [devMode, checkProximityAndUpdate]);

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
    if(value) {
      // Set initial location to the first coordinate in the polyline
      setLocation(polylineCoordinates[0]);
    }
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
                onValueChange={(value) => toggleDevMode(value)}
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
