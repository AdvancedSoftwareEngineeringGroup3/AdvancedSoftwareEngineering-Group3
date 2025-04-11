import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import styles from './components/styles/AccountScreen.styles';
import buttonStyles from './components/common/button';
import { retrieveData, removeData } from './caching';

export default function AccountScreen({ navigation }) {
  const [usernameValid, setUsernameValid] = useState(null);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const username = await retrieveData('username');
        setUsernameValid(username);
      } catch (error) {
        console.error('Error retrieving username:', error);
      }
    };
    fetchUsername();
  }, []);

  const logout = async () => {
    try {
      await removeData('username');
      setUsernameValid(null);
      navigation.navigate('Map');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <SafeAreaView style={styles.container}>
        {usernameValid === null ? (
          <>
            <TouchableOpacity
              style={buttonStyles.button}
              onPress={() => navigation.navigate('LoginScreen')}
              color="#841584"
            >
              <Text style={buttonStyles.buttonText}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={buttonStyles.button}
              onPress={() => navigation.navigate('SignUpScreen')}
              color="#841584"
            >
              <Text style={buttonStyles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={buttonStyles.button}
              onPress={() => navigation.navigate('Map')}
              color="#841584"
            >
              <Text style={buttonStyles.buttonText}>Continue as Guest</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={buttonStyles.button}
              onPress={logout}
              color="#841584"
            >
              <Text style={buttonStyles.buttonText}>Log Out</Text>
            </TouchableOpacity>
            <Text style={styles.Text}>You are logged in</Text>

            {/* todo: Need to make new changes to the preferences logic */}
            <TouchableOpacity
              style={buttonStyles.button}
              onPress={() => navigation.navigate('PreferencesScreen')}
            >
              <Text style={buttonStyles.buttonText}>User Preferences</Text>
            </TouchableOpacity>
          </>
        )}
      </SafeAreaView>
    </View>
  );
}
