import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Alert, TouchableOpacity, Switch } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { decodeRoute, haversine, startLocationTracking, getCurrentLocation } from './mapUtils';

export default function DisplayRouteScreen({ navigation, route }) { // route is a prop passed by the navigator, hence why that is used instead of other variable names
    const { origin, destination, routeData, polylineCoordinates } = route.params;
    const [location, setLocation] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [travelledPolyline, setTravelledPolyline] = useState([]);
    const [currentPolylineIndex, setCurrentPolylineIndex] = useState(0);
    const [stepInstructions, setStepInstructions] = useState('');
    const [devMode, setDevMode] = useState(false);

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
    }, []);

    // Call checkProximityAndUpdate and update setlocation on latitude / longitude button click
    const devMove = ({ delLat=0, delLng=0 }) => {
        setLocation({latitude: location.latitude + delLat, longitude: location.longitude + delLng});
        checkProximityAndUpdate(location);
    };

    // Check proximity to the next coordinate in the polyline
    const checkProximityAndUpdate = (currentLocation) => {
        if (currentPolylineIndex >= polylineCoordinates.length) return;

        const nextCoordinate = polylineCoordinates[currentPolylineIndex];
        const distance = haversine(currentLocation, nextCoordinate);
        // console.log('Distance:', distance);

        if (distance < 50) { // Assuming 10 meters as the proximity threshold
            setTravelledPolyline([...travelledPolyline, nextCoordinate]);
            setCurrentPolylineIndex(currentPolylineIndex + 1);
            // setStepInstructions(routeData.legs[0].steps[currentPolylineIndex].html_instructions);

            if (currentPolylineIndex + 1 >= polylineCoordinates.length) {
                Alert.alert('Destination reached', 'You have reached your destination.');
                // Exit functionality or navigate to another screen
                navigation.navigate('Map');
            }
        }
    };

    return (
        <View style={styles.container}>
            {errorMessage ? (
                <Text style={styles.error}>{errorMessage}</Text>
            ) : location && routeData ? (
                <>
                    <View style={styles.infoContainer}>
                        <View style={styles.routeInfoContainer}>
                            <Text style={styles.routeInfo}>
                                Route from {origin} to {destination}
                            </Text>
                            <Text style={styles.routeInfo}>
                                Distance: {routeData.legs[0].distance.text}
                            </Text>
                            <Text style={styles.routeInfo}>
                                Duration: {routeData.legs[0].duration.text}
                            </Text>
                        </View>
                        <View style={styles.devModeContainer}>
                            <Text style={styles.devModeText}>Dev Mode</Text>
                            <Switch
                                value={devMode}
                                onValueChange={(value) => setDevMode(value)}
                            />
                        </View>
                    </View>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: routeData.legs[0].start_location.lat,
                            longitude: routeData.legs[0].start_location.lng,
                            latitudeDelta: 1,
                            longitudeDelta: 1,
                        }}
                    >
                        <Marker
                            coordinate={location}
                            title="Your Location"
                            description="Real-time location"
                            icon={require('./assets/location-circle.png')}
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
                        <View style={styles.dpadContainer}>
                            <TouchableOpacity onPress={() => devMove({ delLat: 0.0003 })} style={styles.dpadButton}>
                                <Text>lat +</Text>
                            </TouchableOpacity>
                            <View style={styles.dpadRow}>
                                <TouchableOpacity onPress={() => devMove({ delLng: -0.0004 })} style={styles.dpadButton}>
                                    <Text>long -</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => devMove({ delLng: 0.0004 })} style={styles.dpadButton}>
                                    <Text>long +</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity onPress={() => devMove({ delLat: -0.0003 })} style={styles.dpadButton}>
                                <Text>lat -</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </>
            ) : (
                <Text style={styles.loadingText}>Fetching your location...</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    routeInfo: { fontSize: 16 },
    error: { color: 'red', textAlign: 'center', margin: 10 },
    loadingText: { textAlign: 'center', margin: 10 },
    dpadContainer: {
        position: 'absolute',
        bottom: 20,
        left: '50%',
        transform: [{ translateX: -50 }],
        alignItems: 'center',
    },
    dpadRow: {
        flexDirection: 'row',
    },
    dpadButton: {
        padding: 10,
        backgroundColor: '#ADD8E6',
        borderRadius: 5,
        margin: 5,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 10,
    },
    routeInfoContainer: {
        flex: 1,
    },
    devModeContainer: {
        alignItems: 'center',
    },
    devModeText: {
        fontSize: 16,
        marginBottom: 5,
    },
});
