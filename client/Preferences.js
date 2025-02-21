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

            <View style={styles.switchContainer}>
                <Text> Private Vehicle </Text> 
                <Switch
                //trackColor={{false: '#767577', true: '#81b0ff'}}
                value={userPreferences.privateVehicle}
                onValueChange={() => handleToggle("privateVechicle")}
                />
            </View>

            <View style={styles.switchContainer}>
                <Text> Accessibility </Text> 
                <Switch
                //trackColor={{false: '#767577', true: '#81b0ff'}}
                value={userPreferences.accessibility}
                onValueChange={() => handleToggle("accessibility")}
                />
            </View>

            <View style={styles.switchContainer}>
                <Text> Motorways </Text> 
                <Switch
                //trackColor={{false: '#767577', true: '#81b0ff'}}
                value={userPreferences.motorways}
                onValueChange={() => handleToggle("motorways")}
                />
            </View>


            <View style={styles.switchContainer}>
                <Text> tolls </Text> 
                <Switch
                //trackColor={{false: '#767577', true: '#81b0ff'}}
                value={userPreferences.tolls}
                onValueChange={() => handleToggle("tolls")}
                />
            </View>


            <View style={styles.switchContainer}>
                <Text> Bus </Text> 
                <Switch
                //trackColor={{false: '#767577', true: '#81b0ff'}}
                value={userPreferences.bus}
                onValueChange={() => handleToggle("bus")}
                />
            </View>

            <View style={styles.switchContainer}>
                <Text> Car </Text> 
                <Switch
                //trackColor={{false: '#767577', true: '#81b0ff'}}
                value={userPreferences.car}
                onValueChange={() => handleToggle("car")}
                />
            </View>

            <View style={styles.switchContainer}>
                <Text> train </Text> 
                <Switch
                //trackColor={{false: '#767577', true: '#81b0ff'}}
                value={userPreferences.train}
                onValueChange={() => handleToggle("train")}
                />
            </View>

            <View style={styles.switchContainer}>
                <Text> Walk </Text> 
                <Switch
                //trackColor={{false: '#767577', true: '#81b0ff'}}
                value={userPreferences.walk}
                onValueChange={() => handleToggle("walk")}
                />
            </View>

            <View style={styles.switchContainer}>
                <Text> Tram </Text> 
                <Switch
                //trackColor={{false: '#767577', true: '#81b0ff'}}
                value={userPreferences.tram}
                onValueChange={() => handleToggle("tram")}
                />
            </View>

            <View style={styles.switchContainer}>
                <Text> I own a Bike </Text> 
                <Switch
                //trackColor={{false: '#767577', true: '#81b0ff'}}
                value={userPreferences.personalBike}
                onValueChange={() => handleToggle("personalBike")}
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