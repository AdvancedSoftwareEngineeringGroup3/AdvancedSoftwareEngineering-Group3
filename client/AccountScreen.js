import * as React from 'react';
import { useState, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, TextInput, Button, TouchableOpacity, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';


export default function AccountScreen({ navigation }) {


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

      <SafeAreaView style={styles.container}>
        

        <TouchableOpacity style={styles.TouchableOpacity1} onPress={() => navigation.navigate('LoginScreen')}
          color="#841584">
          <Text>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.TouchableOpacity2} onPress={() => navigation.navigate('SignUpScreen')}
          color="#841584">
          <Text>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.TouchableOpacity3} onPress={() => navigation.navigate('Map')}
          color="#841584">
          <Text>Continue as Guest</Text>
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
  TouchableOpacity1: {
    alignItems: 'center',
    left: '0%',
    top: '20%',
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
  TouchableOpacity2: {
    alignItems: 'center',
    left: '0%',
    top: '30%',
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
  TouchableOpacity3: {
    alignItems: 'center',
    left: '0%',
    top: '40%',
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