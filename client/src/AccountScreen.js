import * as React from 'react';
import { View, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import styles from './components/styles/AccountScreen.styles';
import buttonStyles from './components/common/button';
import { retrieveData, removeData } from './caching';

export default function AccountScreen({ navigation }) {
  const logout = async () => {
    try {
      await removeData('username');
    } catch (error) {
      console.error('Error logging out:', error);
    }
    navigation.replace('AccountScreen');
    // navigation.navigate('Map'); ????
  };
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <SafeAreaView style={styles.container}>
        {retrieveData('username') === null ? (
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
            {/* maybe just have the logout button here????? */}
            <Text style={styles.Text}>You are logged in</Text>
            <TouchableOpacity
              style={styles.TouchableOpacity}
              onPress={() => navigation.navigate('Map')}
              color="#841584"
            >
              <Text style={styles.TouchableOpacityText}>Go to Map</Text>
            </TouchableOpacity>
          </>
        )}
      </SafeAreaView>
    </View>
  );
}
