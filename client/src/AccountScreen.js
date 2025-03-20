import * as React from 'react';
import { View, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import styles from './components/styles/AccountScreen.styles';
import buttonStyles from './components/common/button';

export default function AccountScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <SafeAreaView style={styles.container}>
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
      </SafeAreaView>
    </View>
  );
}
