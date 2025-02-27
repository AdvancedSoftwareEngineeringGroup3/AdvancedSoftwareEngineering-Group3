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
    // declare decodedPath as a global varibale so it can be used for destination marker
    let decodedPath = [];

    // Get current location
    useEffect(() => {
        (async () => {
            try {
                const initialLocation = await getCurrentLocation();
                setLocation(initialLocation);
                console.log(location);

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
            decodedPath = decodeRoute(encodedPolyline); // Decode into lat/lng pairs
            // TODO: find out what decoded path looks like
            console.log(decodedPath[decodedPath.length - 1]);
            setPolylineCoordinates(decodedPath);
            setRoutes(routeData.routes); // Set the routes state
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
                            latitude: routes.length > 0 ? routes[0].legs[0].start_location.lat : location.latitude,
                            longitude: routes.length > 0 ? routes[0].legs[0].start_location.lng : location.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    >
                        <Marker
                            coordinate={location}
                            title="Your Location"
                            description="Real-time location"
                        />
                        {/* TODO: add destination marker */} 
                        {decodedPath.length > 0 && (
                        <Marker
                            coordinate={decodedPath[decodedPath.length - 1]}
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
