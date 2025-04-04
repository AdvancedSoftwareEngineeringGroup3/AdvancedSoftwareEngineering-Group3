import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './src/LogIn';
import MapScreen from './src/Map';
import WeatherScreen from './src/Weather';
import FindRouteScreen from './src/FindRoute';
import SelectRouteScreen from './src/SelectRoute';
import Dashboard from './src/SustainabilityDashboard';
import PreferencesScreen from './src/Preferences';
import AccountScreen from './src/AccountScreen';
import SignUpScreen from './src/SignUp';
import DisplayRouteScreen from './src/DisplayRoute';
import FriendsScreen from './src/FriendsScreen';
import { retrieveData } from './src/caching';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AccountScreen">
        <Stack.Screen
          options={{ headerBackVisible: false }}
          name="Map"
          component={MapScreen}
        />
        {retrieveData('username') === null ? (
          <Stack.Screen
            options={{ headerBackVisible: false }}
            name="AccountScreen"
            component={AccountScreen}
          />
        ) : (
          <Stack.Screen
            options={{ headerBackVisible: false }}
            name="MapScreen"
            component={MapScreen}
          />
        )}
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="WeatherScreen" component={WeatherScreen} />
        <Stack.Screen name="FindRouteScreen" component={FindRouteScreen} />
        <Stack.Screen name="SelectRouteScreen" component={SelectRouteScreen} />
        <Stack.Screen
          name="DisplayRouteScreen"
          component={DisplayRouteScreen}
        />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="PreferencesScreen" component={PreferencesScreen} />
        <Stack.Screen name="FriendsScreen" component={FriendsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
