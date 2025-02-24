import * as React from 'react';
import { useState, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, TextInput, Button, Switch, TouchableOpacity, Text, KeyboardAvoidingView, Platform } from 'react-native';

export default function FriendsScreen({ navigation }) {

    const [username, setUsername] = useState("");

    const [FriendsUI, setFriendsUI] = useState({
        FriendsList: false,
        pendingFriendsList:false,
    })
    
    const handleToggle = (key) => {
        setUserPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
      };

    const handleClick = () => {
        // sends information inputted in text box to server

    };

    return (

    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
       <SafeAreaView style={styles.container}>
            <View style={styles.buttonContainer}>
                <Button title="Send Friend Request" onPress={handleClick} />
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
    ButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10,
    },
});