import * as React from 'react';
import { useState, useRef } from 'react';
import {
  Platform,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Text,
  ImageBackground,
  View,
} from 'react-native';
import Picker from 'react-native-picker-select';
import ActionSheet from 'react-native-actionsheet';
import {
  findRouteStyles,
  pickerSelectStyles,
} from './components/styles/FindRoute.styles';
import bgImage from './assets/FindRouteScreen/Navigationbackground.png';
import { retrieveData } from './caching';
import { getCurrentLocation } from './utils/mapUtils';

export default function FindRouteScreen({ navigation }) {
  const pickerRef = useRef();
  const actionSheetRef = useRef();
  const [start, setStartPoint] = useState('');
  const [destination, setDestinationPoint] = useState('');
  const ref2 = React.useRef(null);

  const [selectedMode, setSelectedMode] = useState(null);

  const isFormValid =
    start.trim() !== '' && destination.trim() !== '' && selectedMode !== null;

  const fetchRoutes = async () => {
    let username = await retrieveData('username');
    if (username == null) {
      username = '';
    }

    try {
      let originToSend = start.trim();

      // Check for "current location" variations
      const normalizedStart = originToSend.toLowerCase();
      const isCurrentLocation =
        normalizedStart === 'current location' ||
        normalizedStart === 'Current Location' ||
        normalizedStart === 'my location';

      if (isCurrentLocation) {
        const initialLocation = await getCurrentLocation();
        if (!initialLocation) {
          alert('Unable to fetch current location.');
          return;
        }

        originToSend = `${initialLocation.latitude},${initialLocation.longitude}`;
      }

      const payload = {
        origin: originToSend,
        destination,
        mode: selectedMode,
        alternatives: true,
        username,
      };

      const baseUrl =
        Platform.OS === 'web'
          ? 'http://localhost'
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

      if (data.error) {
        alert(`Error finding route: ${response.message || response.status}`);
        return;
      }
      navigation.navigate('SelectRouteScreen', {
        origin: originToSend,
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
    <ImageBackground
      source={bgImage}
      style={findRouteStyles.container}
      resizeMode="cover"
    >
      <SafeAreaView style={findRouteStyles.container}>
        <TextInput
          style={findRouteStyles.input}
          placeholder="Enter starting point"
          value={start}
          onChangeText={setStartPoint}
          onSubmitEditing={() => ref2.current.focus()}
        />

        <TouchableOpacity
          style={findRouteStyles.useLocationButton}
          onPress={() => setStartPoint('Current Location')}
        >
          <Text style={findRouteStyles.useLocationButtonText}>
            📍 Use Current Location as Start
          </Text>
        </TouchableOpacity>

        <TextInput
          ref={ref2}
          style={findRouteStyles.input}
          placeholder="Enter destination point"
          value={destination}
          onChangeText={setDestinationPoint}
          onSubmitEditing={() => alert(`Route Entered`)}
        />

        <Text style={findRouteStyles.label}>Mode of Transport:</Text>
        {Platform.OS === 'android' ? (
          <TouchableOpacity onPress={() => pickerRef.current.togglePicker()}>
            <View style={findRouteStyles.pickerWrapper}>
              <Picker
                ref={pickerRef}
                onValueChange={handlePickerSelect}
                items={modeDropdownData}
                placeholder={{ label: 'Choose a mode ...', value: null }}
                useNativeAndroidPickerStyle={false}
                style={pickerSelectStyles}
                doneText="Done"
              />
            </View>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={findRouteStyles.dropdownButton}
              onPress={() => actionSheetRef.current.show()}
              activeOpacity={0.8}
            >
              <Text style={findRouteStyles.dropdownButtonText}>
                {selectedMode
                  ? `Selected: ${selectedMode}`
                  : 'Choose an option ▼'}
              </Text>
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
        {/* {selectedMode && (
        <Text style={findRouteStyles.selected}>Selected: {selectedMode}</Text>
      )} */}

        <TouchableOpacity
          style={[
            findRouteStyles.button,
            !isFormValid && findRouteStyles.disabledButton,
          ]}
          disabled={!isFormValid}
          onPress={isFormValid ? fetchRoutes : null}
        >
          <Text style={findRouteStyles.buttonText}>Search</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
}
