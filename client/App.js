import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './LogIn';
import MapScreen from './Map';
import WeatherScreen from './Weather';
import FindRouteScreen from './FindRoute';
import DisplayRouteScreen from './DisplayRoute';
import Dashboard from './SustainabilityDashboard'
import PreferencesScreen from './Preferences'
import AccountScreen from './AccountScreen';
import SignUpScreen from './SignUp';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AccountScreen">
        <Stack.Screen options={{headerBackVisible:false}} name="Map" component={MapScreen} />
        <Stack.Screen options={{headerBackVisible:false}} name="AccountScreen" component={AccountScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="WeatherScreen" component={WeatherScreen} />
        <Stack.Screen name="FindRouteScreen" component={FindRouteScreen} />
        <Stack.Screen name="DisplayRouteScreen" component={DisplayRouteScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="PreferencesScreen" component={PreferencesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


