import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { decodeRoute, startLocationTracking } from './mapUtils';

export default function DisplayRouteScreen({ navigation, route }) {
    const { origin, destination, routeData, polylineCoordinates } = route.params;
    const [location, setLocation] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const startTracking = async () => {
            try {
                await startLocationTracking((currentLocation) => {
                    setLocation(currentLocation);
                });
            } catch (error) {
                console.error('Error starting location tracking:', error);
            }
        };

        startTracking();
    }, []);

    // update users location dynamically - DONE
    // check proximity to polyline coords, " are you here yet"
    // generate travelled polyline
    // display next direction
    // recentre user location on map
    // exit functionality when destination reached

    return (
        <View style={styles.container}>
            {errorMessage ? (
                <Text style={styles.error}>{errorMessage}</Text>
            ) : location && currentRoute ? (
                <>
                    <View>
                        <Text style={styles.routeInfo}>
                            Route from {origin} to {destination}
                        </Text>
                        <Text style={styles.routeInfo}>
                            Distance: {currentRoute.legs[0].distance.text}
                        </Text>
                        <Text style={styles.routeInfo}>
                            Duration: {currentRoute.legs[0].duration.text}
                        </Text>
                    </View>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: currentRoute.legs[0].start_location.lat,
                            longitude: currentRoute.legs[0].start_location.lng,
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
                        {polylineCoordinates.length > 0 && (
                        <Marker
                            coordinate={polylineCoordinates[polylineCoordinates.length - 1]}
                            title="Destination"
                            description="Destination of the route"
                        />
                        )}
                        {polylineCoordinates.length > 0 && (
                        <Polyline
                            coordinates={polylineCoordinates}
                            strokeColor="#1063D5"
                            strokeWidth={4}
                        />
                        )}
                    </MapView>
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
});
