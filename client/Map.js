import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Dashboard from './SustainabilityDashboard';
import { getCurrentLocation, startLocationTracking } from './mapUtils';

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
        
        socket.onmessage = (event) => console.log('Message from server:', event.data); // check if required
        socket.onerror = (error) => console.error('WebSocket error:', error);
        socket.onclose = () => console.log('WebSocket connection closed');

        return () => socket.close();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const initialLocation = await getCurrentLocation();
                setLocation(initialLocation);

                const locationSubscription = await startLocationTracking(setLocation);

                return () => locationSubscription.remove();
            } catch (error) {
                setErrorMessage(error.message);
            }
        })();
    }, []);

    // Send Location to WebSocket
    const sendLocation = () => {
        if (webSocket && location) {
            webSocket.send(JSON.stringify(location));
            console.log('Sent location:', location);
        } else {
            Alert.alert(
                'Location/WebSocket Issue',
                !location ? 'Fetching GPS location...' : 'WebSocket not connected.'
            );
        }
    };

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
                            icon={require('./assets/location-circle.png')}
                        />
                    </MapView>
                    <TouchableOpacity style={styles.sendButton} onPress={sendLocation}>
                        <Text style={styles.buttonText}>Send Location</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => navigation.navigate('AccountScreen')}
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
                        style={styles.findRouteButton}
                        onPress={() => navigation.navigate('FindRouteScreen')}
                    >
                        <Text style={styles.buttonText}>Find Route</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.friendScreenButton}
                        onPress={() => navigation.navigate('FriendsScreen')}
                    >
                        <Text style={styles.buttonText}>Friends UI</Text>
                    </TouchableOpacity>

            
                    <TouchableOpacity
                        style={styles.dashboardButton}
                        onPress={() => navigation.navigate('Dashboard')}
                    >
                        <Text style={styles.buttonText}>Sustainability Dashboard</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.weatherButton}
                        onPress={() => navigation.navigate('WeatherScreen')}
                    >
                        <Text style={styles.buttonText}>Weather</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.PreferencesButton}
                        onPress={() => navigation.navigate('PreferencesScreen')}
                    >
                        <Text style={styles.buttonText}>User Preferences</Text>
                    </TouchableOpacity>

                </>
            ) : (
                <Text style={styles.loadingText}>Fetching your location...</Text>
            )}
        </View>
    );
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
        bottom: 15,
        left: '80%',
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
    loginButton: {
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
    PreferencesButton: {
        position: 'absolute',
        alignItems: 'center',
        left: '0%',
        top: '10%',
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

    friendScreenButton: {
        position: 'absolute',
        alignItems: 'center',
        left: '70%',
        top: '50%',
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
    weatherButton: {
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
    dashboardButton: {
        position: 'absolute',
        alignItems: 'center',
        left: '0%',
        top: '93%',
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 10,
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