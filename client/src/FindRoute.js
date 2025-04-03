import * as React from 'react';
import { useState, useRef } from 'react';
import {
  Platform,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Text,
  ImageBackground,
} from 'react-native';
import Picker from 'react-native-picker-select';
import ActionSheet from 'react-native-actionsheet';
import {
  findRouteStyles,
  pickerSelectStyles,
} from './components/styles/FindRoute.styles';
import bgImage from './assets/FindRouteScreen/Navigationbackground.png'

export default function FindRouteScreen({ navigation }) {
  const pickerRef = useRef();
  const actionSheetRef = useRef();
  const [start, setStartPoint] = useState('');
  const [destination, setDestinationPoint] = useState('');
  const ref2 = React.useRef(null);

  const [selectedMode, setSelectedMode] = useState(null);

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
          {selectedMode ? `Selected: ${selectedMode}` : 'Choose an option ▼'}
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
