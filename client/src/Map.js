import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getCurrentLocation, startLocationTracking } from './utils/mapUtils';
import locationCircleIcon from './assets/location-circle.png';
import MapStyles from './components/styles/Map.styles';

export default function MapScreen({ navigation }) {
  const [webSocket, setWebSocket] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const mapRef = useRef(null);

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
          <TouchableOpacity
            style={MapStyles.PreferencesButton}
            onPress={() => navigation.navigate('PreferencesScreen')}
          >
            <Text style={MapStyles.buttonText}>User Preferences</Text>
        </TouchableOpacity>
        </>
      );
    }

    return <Text style={MapStyles.loadingText}>Fetching your location...</Text>;
  };

  return <View style={MapStyles.container}>{renderContent()}</View>;
}
