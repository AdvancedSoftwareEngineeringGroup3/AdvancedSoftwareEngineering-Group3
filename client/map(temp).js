import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { decode } from '@googlemaps/polyline-codec'; // For decoding the polyline

export default function MapScreen({ navigation }) {
    const [webSocket, setWebSocket] = useState(null);
    const [location, setLocation] = useState(null); // No hardcoded initial location
    const [errorMessage, setErrorMessage] = useState('');
    const [polylineCoordinates, setPolylineCoordinates] = useState([]); // State for polyline coordinates
    const mapRef = useRef(null); // Reference to the MapView

    // WebSocket Setup
    useEffect(() => {
        const wsUrl = `${process.env.EXPO_PUBLIC_API_URL.replace(/^http/, 'ws')}/ws/location`;
        console.log('Connecting to WebSocket:', wsUrl);

        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            console.log('WebSocket connection opened');
            setWebSocket(socket);
        };

        socket.onmessage = (event) => {
            console.log('Message from server:', event.data);
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            socket.close();
        };
    }, []);

    // Location Setup
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMessage('Permission to access location was denied.');
                return;
            }

            // Fetch initial location
            const currentLocation = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.BestForNavigation,
            });
            const { latitude, longitude } = currentLocation.coords;
            setLocation({ latitude, longitude });

            // Set up continuous location tracking
            const locationSubscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.BestForNavigation,
                    timeInterval: 5000, // Update every 5 seconds
                    distanceInterval: 5, // Update if device moves 5 meters
                },
                (newLocation) => {
                    const { latitude, longitude } = newLocation.coords;
                    console.log('Updated Location:', { latitude, longitude });
                    setLocation({ latitude, longitude });

                    // Animate the map to the new region
                    if (mapRef.current) {
                        mapRef.current.animateToRegion(
                            {
                                latitude,
                                longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            },
                            1000 // Animation duration in milliseconds
                        );
                    }
                }
            );

            return () => locationSubscription.remove();
        })();
    }, []);

    // Function to Fetch and Decode Polyline
    const fetchPolyline = async () => {
        try {
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/wayfinding/get_routes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    origin: "Tara Street, Dublin",
                    destination: "Ashbourne, Ireland",
                    mode: "walking",
                    alternatives: false
                })
            });
    
            const data = await response.json();
    
            if (data.route) {
                setPolylineCoordinates(data.route); // The response is already a list of { latitude, longitude }
            }
        } catch (error) {
            console.error("Error fetching polyline:", error);
        }
    };

    // Function to Send Location to WebSocket
    const sendLocation = () => {
        if (webSocket && location) {
            const locationData = JSON.stringify(location);
            webSocket.send(locationData);
            console.log('Sent location:', locationData);
        } else if (!location) {
            Alert.alert('Location not available', 'Please wait for the GPS to fetch your location.');
        } else {
            Alert.alert('WebSocket not connected', 'Please wait for the WebSocket connection to establish.');
        }
    };

    // Fetch polyline when the component mounts
    useEffect(() => {
        fetchPolyline();
    }, []);

    return (
        <View style={styles.container}>
            {errorMessage ? (
                <Text style={styles.error}>{errorMessage}</Text>
            ) : location ? (
                <>
                    <MapView
                        ref={mapRef}
                        style={styles.map}
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
                        />
                        <Marker
                            coordinate={{ latitude: 53.3498, longitude: -6.2603 }}
                            title="Dublin"
                            description="Marker description"
                        />
                        {/* Render the polyline */}
                        {polylineCoordinates.length > 0 && (
                            <Polyline
                                coordinates={polylineCoordinates}
                                strokeColor="#FF0000" // Red color
                                strokeWidth={3}
                            />
                        )}
                    </MapView>
                    <TouchableOpacity style={styles.sendButton} onPress={sendLocation}>
                        <Text style={styles.buttonText}>Send Location</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.TouchableOpacity}
                        onPress={() => navigation.navigate('LoginScreen')}
                    >
                        <Text style={styles.buttonText}>Log In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.findRouteButton}
                        onPress={() => navigation.navigate('FindRouteScreen')}
                    >
                        <Text style={styles.buttonText}>Find Route</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.TouchableOpacity1}
                        onPress={() => navigation.navigate('WeatherScreen')}
                    >
                        <Text style={styles.buttonText}>Weather</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <Text style={styles.loadingText}>Fetching your location...</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        ...(Platform.OS === 'web' ? { height: '100vh' } : {}),
    },
    map: {
        flex: 1,
        minHeight: 300,
    },
    sendButton: {
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: [{ translateX: -50 }],
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    TouchableOpacity: {
        position: 'absolute',
        alignItems: 'center',
        left: '70%',
        top: '0%',
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 5,
    },
    TouchableOpacity1: {
        position: 'absolute',
        alignItems: 'center',
        left: '0%',
        top: '0%',
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 5,
    },
    findRouteButton: {
        position: 'absolute',
        alignItems: 'center',
        left: '34%',
        top: '0%',
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 35,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 5,
    },
    error: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 18,
        color: 'red',
    },
    loadingText: {
        flex: 1,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 18,
    },
});