import * as React from 'react';
import { useState, useRef } from 'react';
import {
  Platform,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import Picker from 'react-native-picker-select';
import ActionSheet from 'react-native-actionsheet';
import {
  findRouteStyles,
  pickerSelectStyles,
} from './components/styles/FindRoute.styles';
import { retrieveData } from './caching';

export default function FindRouteScreen({ navigation }) {
  const pickerRef = useRef();
  const actionSheetRef = useRef();
  const [start, setStartPoint] = useState('');
  const [destination, setDestinationPoint] = useState('');
  const ref2 = React.useRef(null);

  const [selectedMode, setSelectedMode] = useState(null);

  const isFormValid = start.trim() !== '' && destination.trim() !== '';

  const fetchRoutes = async () => {
    let username = await retrieveData('username');
    if (username == null) {
      username = '';
    }

    try {
      const payload = {
        origin: start,
        destination,
        mode: selectedMode,
        alternatives: true,
        username,
      };

      const baseUrl =
        Platform.OS === 'web'
          ? 'http://localhost:8000'
          : process.env.EXPO_PUBLIC_API_URL;
      console.log(
        `Sending request to ${baseUrl}/wayfinding/preferences/get_routes`,
      );

      const response = await fetch(
        `${baseUrl}/wayfinding/preferences/get_routes`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

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

  const handlePickerSelect = (value) => {
    setSelectedMode(value);
  };

  return (
    <SafeAreaView style={findRouteStyles.container}>
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

      <Text style={findRouteStyles.label}>Select an option:</Text>
      {Platform.OS === 'android' ? (
        <TouchableOpacity onPress={() => pickerRef.current.togglePicker()}>
          <Picker
            ref={pickerRef}
            onValueChange={handlePickerSelect}
            items={modeDropdownData}
            placeholder={{ label: 'Choose an option...', value: null }}
            useNativeAndroidPickerStyle={false}
            style={pickerSelectStyles}
            doneText="Done"
          />
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity onPress={() => actionSheetRef.current.show()}>
            <Text style={findRouteStyles.label}>Choose an option...</Text>
          </TouchableOpacity>
          <ActionSheet
            ref={actionSheetRef}
            title="Select Mode"
            options={modeDropdownData
              .map((item) => item.label)
              .concat('Cancel')}
            cancelButtonIndex={modeDropdownData.length}
            onPress={(index) => {
              if (index !== modeDropdownData.length) {
                handlePickerSelect(modeDropdownData[index].value);
              }
            }}
          />
        </>
      )}
      {selectedMode && (
        <Text style={findRouteStyles.selected}>Selected: {selectedMode}</Text>
      )}

      <TouchableOpacity
        style={findRouteStyles.TouchableOpacity}
        onPress={isFormValid ? fetchRoutes : null}
        color="#841584"
      >
        {/* activeOpacity={isFormValid ? 0.7 : 1} */}
        <Text>Search</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
