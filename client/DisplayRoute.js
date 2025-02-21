import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { decodeRoute, getCurrentLocation, startLocationTracking } from './mapUtils';

export default function DisplayRouteScreen({ route }) {
    const { origin, destination, routeData } = route.params;
    const [routes, setRoutes] = useState([]);
    const [location, setLocation] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [polylineCoordinates, setPolylineCoordinates] = useState([]);

    // Get current location
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

    // Generate polyline
    // Decode and set polyline coordinates
    useEffect(() => {
        if (routeData && routeData.routes && routeData.routes.length > 0) {
            const encodedPolyline = routeData.routes[0].overview_polyline.points;
            const decodedPath = decodeRoute(encodedPolyline); // Decode into lat/lng pairs
            setPolylineCoordinates(decodedPath);
        }
    }, [routeData]);

    return (
        <View style={styles.container}>
            {errorMessage ? (
                <Text style={styles.error}>{errorMessage}</Text>
            ) : location ? (
                <>
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: routes.length > 0 ? routes[0][0].latitude : location.latitude,
                            longitude: routes.length > 0 ? routes[0][0].longitude : location.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    >
                        <Marker
                            coordinate={location}
                            title="Your Location"
                            description="Real-time location"
                        />
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
