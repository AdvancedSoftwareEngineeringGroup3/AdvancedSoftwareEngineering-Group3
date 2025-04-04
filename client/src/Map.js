import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getCurrentLocation, startLocationTracking } from './utils/mapUtils';
import locationCircleIcon from './assets/location-circle.png';
import MapStyles from './components/styles/Map.styles';
import { Platform } from 'react-native';

import accident from './assets/Crowdsource/TrafficAccident.png';
import roadClosure from './assets/Crowdsource/RoadClosure.png';
import roadHazard from './assets/Crowdsource/hazard.png';
import police from './assets/Crowdsource/speeding.png';
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



export default function MapScreen({ navigation }) {
  const [webSocket, setWebSocket] = useState(null);
  const [incidentInfo, setIncidentInfo] = useState([]);
  const [location, setLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const mapRef = useRef(null);

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

  // WebSocket Setup
  useEffect(() => {
    const wsUrl = `${process.env.EXPO_PUBLIC_API_URL.replace(/^http/, 'ws')}/ws/location`;
    console.log('Connecting to WebSocket:', wsUrl);

    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('WebSocket connection opened');
      setWebSocket(socket);
    };

    socket.onmessage = (event) =>
      console.log('Message from server:', event.data); // check if required
    socket.onerror = (error) => console.error('WebSocket error:', error);
    socket.onclose = () => console.log('WebSocket connection closed');

    return () => socket.close();
  }, []);

  // Poll for incidents every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      pollIncident();
    }, 5000); // Poll every 5 seconds

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const initialLocation = await getCurrentLocation();
  //       setLocation(initialLocation);

  //       const locationSubscription = await startLocationTracking(setLocation);

  //       return () => locationSubscription.remove();
  //     } catch (error) {
  //       setErrorMessage(error.message);
  //     }
  //   })();
  // }, []);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const initialLocation = await getCurrentLocation();
        setLocation(initialLocation);

        const locationSubscription = await startLocationTracking(setLocation);

        return () => locationSubscription.remove();
      } catch (error) {
        setErrorMessage(error.message);
        return () => {};
      }
    };
    fetchLocation();
  }, []);

  // Send Location to WebSocket
  const sendLocation = () => {
    if (webSocket && location) {
      webSocket.send(JSON.stringify(location));
      console.log('Sent location:', location);
    } else {
      Alert.alert(
        'Location/WebSocket Issue',
        !location ? 'Fetching GPS location...' : 'WebSocket not connected.',
      );
    }
  };

  const renderContent = () => {
    if (errorMessage) {
      return <Text style={MapStyles.error}>{errorMessage}</Text>;
    }

    if (location) {
      return (
        <>
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
              title="Your Location"
              description="Real-time location"
              icon={locationCircleIcon}
            />
          </MapView>
          <TouchableOpacity style={MapStyles.sendButton} onPress={sendLocation}>
            <Text style={MapStyles.buttonText}>Send Location</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={MapStyles.loginButton}
            onPress={() => navigation.navigate('AccountScreen')}
          >
            <Text style={MapStyles.buttonText}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={MapStyles.findRouteButton}
            onPress={() => navigation.navigate('FindRouteScreen')}
          >
            <Text style={MapStyles.buttonText}>Find Route</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={MapStyles.findRouteButton}
            onPress={() => navigation.navigate('FindRouteScreen')}
          >
            <Text style={MapStyles.buttonText}>Find Route</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={MapStyles.friendScreenButton}
            onPress={() => navigation.navigate('FriendsScreen')}
          >
            <Text style={MapStyles.buttonText}>Friends UI</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={MapStyles.dashboardButton}
            onPress={() => navigation.navigate('Dashboard')}
          >
            <Text style={MapStyles.buttonText}>Sustainability Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={MapStyles.weatherButton}
            onPress={() => navigation.navigate('WeatherScreen')}
          >
            <Text style={MapStyles.buttonText}>Weather</Text>
          </TouchableOpacity>

          {/* todo: Need to make new changes to the preferences logic */}
          {/* <TouchableOpacity
                        style={MapStyles.PreferencesButton}
                        onPress={() => navigation.navigate('PreferencesScreen')}
                    >
                        <Text style={MapStyles.buttonText}>User Preferences</Text>
                    </TouchableOpacity> */}
        </>
      );
    }

    return <Text style={MapStyles.loadingText}>Fetching your location...</Text>;
  };

  return <View style={MapStyles.container}>{renderContent()}</View>;
}

// const styles = StyleSheet.create({
//     container: { flex: 1, ...(Platform.OS === 'web' ? { height: '100vh' } : {}) },
//     map: { flex: 1, minHeight: 300 },
//     sendButton: {
//         position: 'absolute', bottom: 20, left: '50%', transform: [{ translateX: -50 }],
//         backgroundColor: '#007bff', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10,
//     },
//     button: {
//         position: 'absolute', bottom: 60, left: '50%', transform: [{ translateX: -50 }],
//         backgroundColor: '#007bff', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10,
//     },
//     buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
//     error: { flex: 1, textAlign: 'center', fontSize: 18, color: 'red' },
//     loadingText: { flex: 1, textAlign: 'center', fontSize: 18 },
// });
