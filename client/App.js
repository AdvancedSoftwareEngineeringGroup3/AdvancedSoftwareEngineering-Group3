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
  const firstScreen =
    retrieveData('username') === null ? 'AccountScreen' : 'Map';
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={firstScreen}
        screenOptions={({ route }) => {
          switch (route.name) {
            case 'FindRouteScreen':
              return { animation: 'fade' }; // or 'slide_from_bottom' if supported
            case 'Dashboard':
              return { animation: 'slide_from_left' };
            case 'FriendsScreen':
              return { animation: 'slide_from_right' };
            default:
              return { animation: 'fade' };
          }
        }}
      >
        <Stack.Screen
          options={{ headerBackVisible: false }}
          name="Map"
          component={MapScreen}
        />
        <Stack.Screen
          options={{ headerBackVisible: false }}
          name="AccountScreen"
          component={AccountScreen}
        />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="WeatherScreen" component={WeatherScreen} />
        <Stack.Screen
          name="FindRouteScreen"
          component={FindRouteScreen}
          options={{
            title: 'Select Route', // Sets the header title
            headerStyle: {
              backgroundColor: '#99CC66',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen name="SelectRouteScreen" component={SelectRouteScreen} />
        <Stack.Screen
          name="DisplayRouteScreen"
          component={DisplayRouteScreen}
        />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            title: 'Sustainability Dashboard', // Sets the header title
            headerStyle: {
              backgroundColor: '#4CAF50',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen name="PreferencesScreen" component={PreferencesScreen} />
        <Stack.Screen
          name="FriendsScreen"
          component={FriendsScreen}
          options={{
            title: 'Friends Screen', // Sets the header title
            headerStyle: {
              backgroundColor: '#66CCFF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
