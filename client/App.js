import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './LogIn';
import MapScreen from './Map';
import WeatherScreen from './Weather';
import Dashboard from './SustainabilityDashboard'
import PreferencesScreen from './Preferences'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Map">
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="WeatherScreen" component={WeatherScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="PreferencesScreen" component={PreferencesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


