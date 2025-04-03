import { decode } from '@googlemaps/polyline-codec';
import * as Location from 'expo-location';
import { storeData, retrieveData, removeData, updateData } from '../caching';

// Convert degrees to radians
const deg2rad = (deg) => deg * (Math.PI / 180);

// Haversine Formula to calculate distance between two points
export const haversine = (start, end) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(end.latitude - start.latitude);
  const dLon = deg2rad(end.longitude - start.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(start.latitude)) *
      Math.cos(deg2rad(end.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000; // Distance in meters
};

// Extract routes func
// export const extractRoutes = async (
//   route,
//   // origin = '',
//   // destination = '',
//   // mode = 'walking',
// ) => {
//   try {
//     const data = route;

//     return data && data.routes
//       ? data.routes.map((route) => decode(route.overview_polyline.points))
//       : [];
//   } catch (error) {
//     console.error('Error fetching routes:', error);
//     return [];
//   }
// };

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

  if (retrieveData('currentLat') !== null) {
    await removeData('currentLat');
    await updateData('currentLat', location.coords.latitude);
  } else {
    await storeData('currentLat', location.coords.latitude);
  }

  if (retrieveData('currentLon') !== null) {
    await removeData('currentLon');
    await updateData('currentLon', location.coords.longitude);
  } else {
    await storeData('currentLon', location.coords.longitude);
  }

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

  return Location.watchPositionAsync(
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
    },
  );
};

// Decode polyline from API response
export const decodeRoute = (encodedPolyline) => {
  const decodedPath = decode(encodedPolyline); // Returns array of [lat, lng] pairs
  return decodedPath.map(([lat, lng]) => ({ latitude: lat, longitude: lng }));
};
