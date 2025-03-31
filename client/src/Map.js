import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getCurrentLocation, startLocationTracking } from './utils/mapUtils';
import locationCircleIcon from './assets/location-circle.png';
import MapStyles from './components/styles/Map.styles';

export default function MapScreen({ navigation }) {
  const [webSocket, setWebSocket] = useState(null);
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null)
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


              
    // Poll for friend requests every 5 seconds
    //useEffect() => {
      //const intervalId = setInterval(() => {
        //fetchFromServer();
     /// }, 10000); // Poll every 5 seconds
  


  const fetchFromServer = async () => {
      try {
        const baseUrl =
          Platform.OS === 'web'
            ? 'http://localhost:8000'
            : process.env.EXPO_PUBLIC_API_URL;
        console.log(`Sending request to ${baseUrl}/weather?longitude=${location.longitude}?latitude=${ location.latitude}`);
  
        const response = await fetch(`${baseUrl}/weather?longitude=${location.longitude}?latitude=${ location.latitude}`, {
          method: 'GET',
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
  
          // alert(server_message.message);
          setWeather(serverMessage.weather);
        } else {
          // Log the raw response text for debugging
          const responseText = await response.text();
          console.error('Failed to get weather:', responseText);
          alert('Server Error: ', responseText);
        }
      } catch (error) {
        console.error('Error getting real time weather inf', error);
      }
    };

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
  
          <TouchableOpacity
            style={MapStyles.loginButton}
            onPress={() => navigation.navigate('AccountScreen')}
          >
            <Text style={MapStyles.buttonText}>Log In</Text>
          </TouchableOpacity>

          <View style={MapStyles.bar}>
            <Image
            source={require('./assets/MapDashboard/movementbar.png')}
            style={MapStyles.barImage}
            resizeMode="contain"
            />
            <TouchableOpacity onPress={() => navigation.navigate('Dashboard')} style={MapStyles.button}>
              <Image source={require('./assets/MapDashboard/leaficon.png')} style={MapStyles.icon} />
              <Text style={MapStyles.label}>Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('FindRouteScreen')} style={[MapStyles.button, MapStyles.centerButton]}>
              <Image source={require('./assets/MapDashboard/routeicon.png')} style={[MapStyles.icon, MapStyles.centerIcon]} />
              <Text style={MapStyles.label}>Find Route</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('FriendsScreen')} style={MapStyles.button}>
              <Image source={require('./assets/MapDashboard/friendsicon.png')} style={MapStyles.icon} />
              <Text style={MapStyles.label}>Friends</Text>
            </TouchableOpacity>
          </View>
          
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
