import * as React from 'react';
import { useState } from 'react';
import {
  View,
  SafeAreaView,
  Switch,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import Constants from 'expo-constants';
import buttonStyles from './components/common/button';
import containerStyles from './components/common/commonContainer';

// eslint-disable-next-line no-unused-vars
import { storeData, retrieveData, removeData, updateData } from './caching';

// eslint-disable-next-line no-unused-vars
export default function PreferencesScreen({ navigation }) {
  const [isBikeEnabled, setIsBikeEnabled] = useState(false);
  const [isPrivateVehicleEnabled, setIsPrivateVehicleEnabled] = useState(false);
  const [isAccessibilityEnabled, setIsAccessibilityEnabled] = useState(false);
  const [isMotorwaysEnabled, setIsMotorwaysEnabled] = useState(false);
  const [isTollsEnabled, setIsTollsEnabled] = useState(false);
  const [isBusEnabled, setIsBusEnabled] = useState(false);
  const [isCarEnabled, setIsCarEnabled] = useState(false);
  const [isTrainEnabled, setIsTrainEnabled] = useState(false);
  const [isWalkEnabled, setIsWalkEnabled] = useState(false);
  const [isTramEnabled, setIsTramEnabled] = useState(false);
  const [isPersonalBikeEnabled, setIsPersonalBikeEnabled] = useState(false);

  const handleToggleBike = () => setIsBikeEnabled((prev) => !prev);
  const handleTogglePrivateVehicle = () =>
    setIsPrivateVehicleEnabled((prev) => !prev);
  const handleToggleAccessibility = () =>
    setIsAccessibilityEnabled((prev) => !prev);
  const handleToggleMotorways = () => setIsMotorwaysEnabled((prev) => !prev);
  const handleToggleTolls = () => setIsTollsEnabled((prev) => !prev);
  const handleToggleBus = () => setIsBusEnabled((prev) => !prev);
  const handleToggleCar = () => setIsCarEnabled((prev) => !prev);
  const handleToggleTrain = () => setIsTrainEnabled((prev) => !prev);
  const handleToggleWalk = () => setIsWalkEnabled((prev) => !prev);
  const handleToggleTram = () => setIsTramEnabled((prev) => !prev);
  const handleTogglePersonalBike = () =>
    setIsPersonalBikeEnabled((prev) => !prev);

  const savePreferences = async () => {
    try {
      const baseUrl =
        Platform.OS === 'web'
          ? 'http://localhost'
          : Constants.expoConfig.extra.EXPO_PUBLIC_API_URL;
      console.log(`Sending request to ${baseUrl}/setPreferences`);

      // set username
      const cachedUsername = await retrieveData('username');
      // setUsername(cachedusername);

      const response = await fetch(`${baseUrl}/setPreferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: cachedUsername,
          bike: isBikeEnabled,
          privateVehicle: isPrivateVehicleEnabled,
          accessibility: isAccessibilityEnabled,
          motorways: isMotorwaysEnabled,
          tolls: isTollsEnabled,
          bus: isBusEnabled,
          car: isCarEnabled,
          train: isTrainEnabled,
          walk: isWalkEnabled,
          tram: isTramEnabled,
          personalBike: isPersonalBikeEnabled,
        }),
      });

      console.log(
        JSON.stringify({
          username: cachedUsername,
          bike: isBikeEnabled.toString(),
          privateVehicle: isPrivateVehicleEnabled.toString(),
          accessibility: isAccessibilityEnabled.toString(),
          motorways: isMotorwaysEnabled.toString(),
          tolls: isTollsEnabled.toString(),
          bus: isBusEnabled.toString(),
          car: isCarEnabled.toString(),
          train: isTrainEnabled.toString(),
          walk: isWalkEnabled.toString(),
          tram: isTramEnabled.toString(),
          personalBike: isPersonalBikeEnabled.toString(),
        }),
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Await response and print message from server
      const data = await response.json();
      alert(data.message);

      console.log('Server response:', data);
    } catch (error) {
      console.error('Error details:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <SafeAreaView style={containerStyles.container}>
        <View style={containerStyles.switchContainer}>
          <Text> Bike </Text>
          <Switch
            // trackColor={{false: '#767577', true: '#81b0ff'}}
            value={isBikeEnabled}
            onValueChange={handleToggleBike}
          />
        </View>

        <View style={containerStyles.switchContainer}>
          <Text> Private Vehicle </Text>
          <Switch
            // trackColor={{false: '#767577', true: '#81b0ff'}}
            value={isPrivateVehicleEnabled}
            onValueChange={handleTogglePrivateVehicle}
          />
        </View>

        <View style={containerStyles.switchContainer}>
          <Text> Accessibility </Text>
          <Switch
            // trackColor={{false: '#767577', true: '#81b0ff'}}
            value={isAccessibilityEnabled}
            onValueChange={handleToggleAccessibility}
          />
        </View>

        <View style={containerStyles.switchContainer}>
          <Text> Motorways </Text>
          <Switch
            // trackColor={{false: '#767577', true: '#81b0ff'}}
            value={isMotorwaysEnabled}
            onValueChange={handleToggleMotorways}
          />
        </View>

        <View style={containerStyles.switchContainer}>
          <Text> tolls </Text>
          <Switch
            // trackColor={{false: '#767577', true: '#81b0ff'}}
            value={isTollsEnabled}
            onValueChange={handleToggleTolls}
          />
        </View>

        <View style={containerStyles.switchContainer}>
          <Text> Bus </Text>
          <Switch
            // trackColor={{false: '#767577', true: '#81b0ff'}}
            value={isBusEnabled}
            onValueChange={handleToggleBus}
          />
        </View>

        <View style={containerStyles.switchContainer}>
          <Text> Car </Text>
          <Switch
            // trackColor={{false: '#767577', true: '#81b0ff'}}
            value={isCarEnabled}
            onValueChange={handleToggleCar}
          />
        </View>

        <View style={containerStyles.switchContainer}>
          <Text> train </Text>
          <Switch
            // trackColor={{false: '#767577', true: '#81b0ff'}}
            value={isTrainEnabled}
            onValueChange={handleToggleTrain}
          />
        </View>

        <View style={containerStyles.switchContainer}>
          <Text> Walk </Text>
          <Switch
            // trackColor={{false: '#767577', true: '#81b0ff'}}
            value={isWalkEnabled}
            onValueChange={handleToggleWalk}
          />
        </View>

        <View style={containerStyles.switchContainer}>
          <Text> Tram </Text>
          <Switch
            // trackColor={{false: '#767577', true: '#81b0ff'}}
            value={isTramEnabled}
            onValueChange={handleToggleTram}
          />
        </View>

        <View style={containerStyles.switchContainer}>
          <Text> I own a Bike </Text>
          <Switch
            // trackColor={{false: '#767577', true: '#81b0ff'}}
            value={isPersonalBikeEnabled}
            onValueChange={handleTogglePersonalBike}
          />
        </View>

        <TouchableOpacity
          style={buttonStyles.button}
          onPress={savePreferences}
          color="#841584"
        >
          <Text>Save</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}
