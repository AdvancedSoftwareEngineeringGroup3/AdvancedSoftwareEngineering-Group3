import * as React from 'react';
import { useState, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, TextInput, Button, Switch, TouchableOpacity, Text, KeyboardAvoidingView, Platform } from 'react-native';

export default function PreferencesScreen({ navigation }) {

    const [username, setUsername] = useState("");

    const [userPreferences, setUserPreferences] = useState({
        bike: false,
        privateVehicle: false,
        accessibility: false,
        motorways: false,
        tolls: false,
        bus: false,
        car: false,
        train: false,
        walk: false,
        tram: false,
        personalBike: false,
    })
    
    const handleToggle = (key) => {
        setUserPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
      };

    return (

    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <SafeAreaView style={styles.container}>
            <View style={styles.switchContainer}>
                <Text> Bike </Text> 
                <Switch
                //trackColor={{false: '#767577', true: '#81b0ff'}}
                value={userPreferences.bike}
                onValueChange={() => handleToggle("bike")}
                />
            </View>
        </SafeAreaView>
    </View>
    )
}



const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 10,
      paddingHorizontal: 45,
      top: '-20%',
    },
    switchContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10,
      },
});