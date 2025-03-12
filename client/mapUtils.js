import { decode } from '@googlemaps/polyline-codec';
import * as Location from 'expo-location';

// Extract routes func
export const extractRoutes = async (route, origin = "", destination = "", mode = 'walking') => {
    try {
        // const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/wayfinding/get_routes`, {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ origin, destination, mode, alternatives: false })
        // });

        // const data = await response.json();
        data = route

        return data && data.routes ? data.routes.map(route => decode(route.overview_polyline.points)) : [];
    } catch (error) {
        console.error("Error fetching routes:", error);
        return [];
    }
};

// Locations funcs
export const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
};

export const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
        throw new Error('Permission to access location was denied.');
    }

    const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
    });

    return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
    };
};

export const startLocationTracking = async (callback) => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
        throw new Error('Permission to access location was denied.');
    }

    return await Location.watchPositionAsync(
        {
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 5000, // Update every 5 seconds // apparently android only
            distanceInterval: 5, // Update if device moves 5 meters
        },
        (newLocation) => {
            callback({
                latitude: newLocation.coords.latitude,
                longitude: newLocation.coords.longitude,
            });
        }
    );
};

// Decode polyline from API response
export const decodeRoute = (encodedPolyline) => {
    const decodedPath = decode(encodedPolyline); // Returns array of [lat, lng] pairs
    return decodedPath.map(([lat, lng]) => ({ latitude: lat, longitude: lng }));
};