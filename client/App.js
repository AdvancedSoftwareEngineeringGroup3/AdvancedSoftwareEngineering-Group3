import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './LogIn';
import MapScreen from './Map';
import WeatherScreen from './Weather';
import FindRouteScreen from './FindRoute';
import DisplayRouteScreen from './DisplayRoute';
import Dashboard from './SustainabilityDashboard'
import FriendsScreen from './FriendsScreen'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Map">
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="WeatherScreen" component={WeatherScreen} />
        <Stack.Screen name="FindRouteScreen" component={FindRouteScreen} />
        <Stack.Screen name="DisplayRouteScreen" component={DisplayRouteScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="FriendsScreen" component={FriendsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


