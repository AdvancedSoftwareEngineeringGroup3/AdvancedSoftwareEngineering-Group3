import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import {
  decodeRoute,
  getCurrentLocation,
  startLocationTracking,
} from './utils/mapUtils';
import locationCircleIcon from './assets/location-circle.png';
import selectRouteStyles from './components/styles/SelectRoute.styles';

export default function SelectRouteScreen({ navigation, route }) {
  const { origin, destination, routeData } = route.params;
  const [routes, setRoutes] = useState([]);
  const [location, setLocation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [polylineCoordinates, setPolylineCoordinates] = useState([]);
  const [currentRoute, setCurrentRoute] = useState(routeData.routes[0]);

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
        return null;
      }
    })();
  }, [location]);

  // Generate polyline
  // Decode and set polyline coordinates
  useEffect(() => {
    if (routeData && routeData.routes && routeData.routes.length > 0) {
      const encodedPolyline = currentRoute.overview_polyline.points;
      const decodedPath = decodeRoute(encodedPolyline); // Decode into lat/lng pairs
      // if this mode is driving, call the speedlimit api, passing decodedPath
      setPolylineCoordinates(decodedPath);
      setRoutes(routeData.routes); // Set the routes state
    }
  }, [currentRoute.overview_polyline.points, routeData]);

  // Display all route options
  const displaySelectedRoute = (index) => {
    const selectedRoute = routeData.routes[index];
    setCurrentRoute(selectedRoute);
    const encodedPolyline = selectedRoute.overview_polyline.points;
    const decodedPath = decodeRoute(encodedPolyline); // Decode into lat/lng pairs
    setPolylineCoordinates(decodedPath);
  };

  return (
    <View style={selectRouteStyles.container}>
      {errorMessage && (
        <Text style={selectRouteStyles.error}>{errorMessage}</Text>
      )}
      {!errorMessage && location && (
        <>
          <MapView
            style={selectRouteStyles.map}
            initialRegion={{
              latitude:
                routes.length > 0
                  ? routes[0].legs[0].start_location.lat
                  : location.latitude,
              longitude:
                routes.length > 0
                  ? routes[0].legs[0].start_location.lng
                  : location.longitude,
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
          <View>
            {routes.map((routeOption, index) => (
              <View
                key={index} // eslint-disable-line react/no-array-index-key
                style={selectRouteStyles.routeContainer}
              >
                <TouchableOpacity
                  onPress={() => displaySelectedRoute(index)}
                  style={selectRouteStyles.routeButton}
                >
                  <Text>Route {index + 1}</Text>
                  <Text>Distance: {routeOption.legs[0].distance.text}</Text>
                  <Text>Duration: {routeOption.legs[0].duration.text}</Text>
                </TouchableOpacity>
                {/* routeData needs to rename the route variable because that is what react navigator calls its properties */}
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('DisplayRouteScreen', {
                      origin,
                      destination,
                      routeData: routeOption,
                      polylineCoordinates,
                    })
                  }
                  style={selectRouteStyles.startButton}
                >
                  <Text>Start Journey</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </>
      )}
      {!errorMessage && !location && (
        <Text style={selectRouteStyles.loadingText}>Loading...</Text>
      )}
    </View>
  );
}



// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity } from 'react-native';
// import MapView, { Polyline, Marker } from 'react-native-maps';
// import {
//   decodeRoute,
//   getCurrentLocation,
//   startLocationTracking,
// } from './utils/mapUtils';
// import locationCircleIcon from './assets/location-circle.png';
// import selectRouteStyles from './components/styles/SelectRoute.styles';

// export default function SelectRouteScreen({ navigation, route }) {
//     const { origin, destination, routeData } = route.params;
//     const [routes, setRoutes] = useState([]);
//     const [location, setLocation] = useState(null);
//     const [errorMessage, setErrorMessage] = useState('');
//     const [polylineCoordinates, setPolylineCoordinates] = useState([]);
//     const [currentRoute, setCurrentRoute] = useState(routeData.routes[0]);

//     // Get current location
//     useEffect(() => {
//         (async () => {
//             try {
//                 const initialLocation = await getCurrentLocation();
//                 setLocation(initialLocation);

//                 const locationSubscription = await startLocationTracking(setLocation);

//                 return () => locationSubscription.remove();
//             } catch (error) {
//                 setErrorMessage(error.message);
//                 return null;
//             }
//         })();
//     }, []);

//     // Generate polyline
//     // Decode and set polyline coordinates
//     useEffect(() => {
//         if (routeData && routeData.routes && routeData.routes.length > 0) {
//             const encodedPolyline = currentRoute.overview_polyline.points;
//             const decodedPath = decodeRoute(encodedPolyline); // Decode into lat/lng pairs
//             // if this mode is driving, call the speedlimit api, passing decodedPath
//             setPolylineCoordinates(decodedPath);
//             setRoutes(routeData.routes); // Set the routes state
//         }
//     }, [routeData]);

//     // Display all route options
//     const displaySelectedRoute = (index) => {
//         const selectedRoute = routeData.routes[index];
//         setCurrentRoute(selectedRoute);
//         const encodedPolyline = selectedRoute.overview_polyline.points;
//         const decodedPath = decodeRoute(encodedPolyline); // Decode into lat/lng pairs
//         setPolylineCoordinates(decodedPath);
//     };

//     return (
//         <View style={selectRouteStyles.container}>
//             {errorMessage ? (
//                 <Text style={selectRouteStyles.error}>{errorMessage}</Text>
//             ) : location ? (
//                 <>
//                     <MapView
//                         style={selectRouteStyles.map}
//                         initialRegion={{
//                             latitude:
//                               routes.length > 0
//                                 ? routes[0].legs[0].start_location.lat
//                                 : location.latitude,
//                             longitude:
//                               routes.length > 0
//                                 ? routes[0].legs[0].start_location.lng
//                                 : location.longitude,
//                             latitudeDelta: 0.01,
//                             longitudeDelta: 0.01,
//                         }}
//                     >
//                         <Marker
//                             coordinate={location}
//                             title="Your Location"
//                             description="Real-time location"
//                             icon={locationCircleIcon}
//                         />
//                         {polylineCoordinates.length > 0 && (
//                         <Marker
//                             coordinate={polylineCoordinates[polylineCoordinates.length - 1]}
//                             title="Destination"
//                             description="Destination of the route"
//                         />
//                         )}
//                         {polylineCoordinates.length > 0 && (
//                         <Polyline
//                             coordinates={polylineCoordinates}
//                             strokeColor="#1063D5"
//                             strokeWidth={4}
//                         />
//                         )}
//                     </MapView>
//                     <View>
//                         {routes.map((routeOption, index) => {
//                             return (
//                                 <View key={index} style={selectRouteStyles.routeContainer}>
//                                     <TouchableOpacity onPress={() => displaySelectedRoute(index)} style={selectRouteStyles.routeButton}>
//                                         <Text>Route {index + 1}</Text>
//                                         <Text>Distance: {routeOption.legs[0].distance.text}</Text>
//                                         <Text>Duration: {routeOption.legs[0].duration.text}</Text>
//                                     </TouchableOpacity>
//                                     {/* routeData needs to rename the route variable because that is what react navigator calls its properties */}
//                                     <TouchableOpacity
//                                       onPress={() => 
//                                         navigation.navigate('DisplayRouteScreen', {
//                                           origin,
//                                           destination,
//                                           routeData: routeOption,
//                                           polylineCoordinates,
//                                         })}
//                                         style={selectRouteStyles.startButton}
//                                         >
//                                         <Text>Start Journey</Text>
//                                     </TouchableOpacity>
//                                 </View>
//                             )})}
//                     </View>
//                 </>
//             ) : (
//                 <Text style={selectRouteStyles.loadingText}>Fetching your location...</Text>
//             )}
//         </View>
//     );
// }
