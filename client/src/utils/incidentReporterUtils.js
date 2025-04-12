import { Platform } from 'react-native';
import Constants from 'expo-constants';

export const postIncident = async (incidentData, customBaseUrl = null) => {
  console.log('Sending data:', incidentData);
  try {
    const baseUrl =
      customBaseUrl ||
      (Platform.OS === 'web'
        ? 'http://localhost'
        : Constants.expoConfig.extra.EXPO_PUBLIC_API_URL);
    console.log(`Sending request to ${baseUrl}/report_incident}`);

    const response = await fetch(`${baseUrl}/report_incident`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(incidentData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    alert(data.message);

    return data;
  } catch (error) {
    console.error('Error details:', error);
    throw error;
  }
};

export default postIncident;
