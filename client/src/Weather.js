import * as React from 'react';
import { useState } from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import Constants from 'expo-constants';
import buttonStyles from './components/common/button';
import containerStyles from './components/common/commonContainer';

export default function WeatherScreen() {
  const [serverResponse, setServerResponse] = useState('');

  const fetchFromServer = async () => {
    try {
      const baseUrl =
        Platform.OS === 'web'
          ? 'http://localhost'
          : Constants.expoConfig.extra.EXPO_PUBLIC_API_URL;
      console.log(`Sending request to ${baseUrl}/weather`);

      const response = await fetch(`${baseUrl}/weather`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Server response:', data);
      setServerResponse('Data has been queried successfully!');
      await Promise((resolve) => setTimeout(resolve, 3000));
      setServerResponse('');
    } catch (error) {
      console.error('Error details:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <SafeAreaView style={containerStyles.container}>
        <TouchableOpacity
          style={buttonStyles.button}
          onPress={fetchFromServer}
          color="#841584"
        >
          <Text>Weather Data</Text>
        </TouchableOpacity>
      </SafeAreaView>
      <View style={containerStyles.container}>
        <Text>{serverResponse}</Text>
      </View>
    </View>
  );
}
