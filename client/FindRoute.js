import * as React from 'react';
import { useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

export default function FindRouteScreen({ navigation }) {
  const [start, setStartPoint] = useState('');
  const [destination, setDestinationPoint] = useState('');
  const ref2 = React.useRef(null);

  const [selectedMode, setSelectedMode] = useState(null);

  const [setServerResponse] = useState('');

  const isFormValid = start.trim() !== '' && destination.trim() !== '';

  const fetchRoutes = async () => {
    try {
      const payload = {
        origin: start,
        destination,
        mode: selectedMode,
        alternatives: true,
      };

      const baseUrl =
        Platform.OS === 'web'
          ? 'http://localhost:8000'
          : process.env.EXPO_PUBLIC_API_URL;
      console.log(`Sending request to ${baseUrl}/wayfinding/get_routes`);

      const response = await fetch(`${baseUrl}/wayfinding/get_routes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Server response:', data);

      setServerResponse('Data has been queried successfully!');
      // await new Promise(resolve => setTimeout(resolve, 3000));
      // setServerResponse("")

      // Navigate to SelectRouteScreen with the response data
      navigation.navigate('SelectRouteScreen', {
        origin: start,
        destination,
        routeData: data,
      });
    } catch (error) {
      console.error('Error details:', error);
    }
  };

  const modeDropdownData = [
    { label: 'Walking', value: 'walking' },
    { label: 'Driving', value: 'driving' },
    { label: 'Transit', value: 'transit' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        placeholder="Enter starting point"
        value={start}
        onChangeText={(text) => setStartPoint(text)}
        onSubmitEditing={() => ref2.current.focus()}
      />
      <TextInput
        ref={ref2}
        placeholder="Enter destination point"
        value={destination}
        onChangeText={(text) => setDestinationPoint(text)}
        onSubmitEditing={() => alert(`Route Entered`)}
      />

      <Text style={styles.label}>Select an option:</Text>
      <RNPickerSelect
        onValueChange={(value) => setSelectedMode(value)}
        items={modeDropdownData}
        placeholder={{ label: 'Choose an option...', value: null }}
      />
      {selectedMode && (
        <Text style={styles.selected}>Selected: {selectedMode}</Text>
      )}

      <TouchableOpacity
        style={styles.TouchableOpacity}
        onPress={isFormValid ? fetchRoutes : null}
        color="#841584"
      >
        {/* activeOpacity={isFormValid ? 0.7 : 1} */}
        <Text>Search</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
