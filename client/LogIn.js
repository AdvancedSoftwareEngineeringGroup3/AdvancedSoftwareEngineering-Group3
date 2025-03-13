import * as React from 'react';
import { useState, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, TextInput, Button, TouchableOpacity, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { handleLogin, handleSignup } from "./accountUtils";


export default function LoginScreen({ navigation }) {
  const [serverResponse, setServerResponse] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const ref2 = React.useRef(null);

  // const handleLogin = async () => {
  //   if (username == '' || password == '') {
  //     alert("All fields have to be filled before logging in!")
  //   }
  //   else {
  //     console.log('username: ', username)
  //     console.log('password: ', password)
  //     navigation.goBack()

  //     try {
  //       const baseUrl = Platform.OS === 'web'
  //         ? 'http://localhost:8000'
  //         : process.env.EXPO_PUBLIC_API_URL;
  //       console.log(`Sending request to ${baseUrl}/login`);

  //       const response = await fetch(`${baseUrl}/login`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ username: username, password: password }),
  //       });

  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }

  //       // Await response and print message from server
  //       const data = await response.json();
  //       alert(data.message)

  //       if (data.message == `Login successful for user: ${username}`) {
  //         await removeData("username");
  //         await updateData ("username", username);
  //       }

  //       // if the data is "success", then cache details        

  //       console.log('Server response:', data);
  //       setServerResponse(data.message);
  //     } catch (error) {
  //       console.error('Error details:', error);
  //       setServerResponse(`Error: ${error.message}`);
  //     }
  //   }
  // };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

      <SafeAreaView style={styles.container}>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
          style={styles.TextInput}
          onSubmitEditing={() => ref2.current.focus()}
        />

        <TextInput
          ref={ref2}
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          style={styles.TextInput}
        />

        <TouchableOpacity style={styles.TouchableOpacity} onPress={() => handleLogin(username, password, setServerResponse, navigation)}
          color="#841584">
          <Text>Log In</Text>
        </TouchableOpacity>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 45,
    top: '-20%',
    //marginBottom: -150,
  },
  TextInput: {
    width: 100,
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  TouchableOpacity: {
    alignItems: 'center',
    left: '0%',
    top: '5%',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  TouchableOpacity1: {
    alignItems: 'center',
    left: '0%',
    top: '5%',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  TouchableOpacityText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});