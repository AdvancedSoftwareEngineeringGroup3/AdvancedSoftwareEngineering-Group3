import * as React from 'react';
import { useState, useRef } from 'react';
import { Platform } from 'react-native';
import { StyleSheet, View, SafeAreaView, TextInput, Button, TouchableOpacity, Text, KeyboardAvoidingView } from 'react-native';
import Picker from 'react-native-picker-select';
import ActionSheet from 'react-native-actionsheet';

export default function FindRouteScreen({ navigation }){

    const pickerRef = useRef();
    const actionSheetRef = useRef();
    const [start, setStartPoint] = useState("");
    const [destination, setDestinationPoint] = useState("");
    const ref2 = React.useRef(null);

    const[selectedMode, setSelectedMode] = useState(null);

    const [serverResponse, setServerResponse] = useState('');

    const isFormValid = start.trim() !== '' && destination.trim() !== '';

    const fetchRoutes = async () => {
        try {
          const payload = {
            origin: start,
            destination: destination,
            mode: selectedMode,
            alternatives: true,
          };

            const baseUrl = Platform.OS === 'web'
                ? 'http://localhost:8000'
                : process.env.EXPO_PUBLIC_API_URL;
            console.log(`Sending request to ${baseUrl}/wayfinding/get_routes`);

            const response = await fetch(`${baseUrl}/wayfinding/get_routes`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                  },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Server response:', data);

            setServerResponse("Data has been queried successfully!")
            // await new Promise(resolve => setTimeout(resolve, 3000));
            // setServerResponse("")

            // Navigate to SelectRouteScreen with the response data
            navigation.navigate('SelectRouteScreen', { origin: start, destination, routeData: data });

        } catch (error) {
            console.error('Error details:', error);
        }
    };

    const modeDropdownData = [
        {label: 'Walking', value: 'walking'},
        {label: 'Driving', value: 'driving'},
        {label: 'Transit', value: 'transit'}
    ];

    const handlePickerSelect = (value) => {
        setSelectedMode(value);
    };

    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                placeholder="Enter starting point"
                value={start}
                onChangeText={(text) => setStartPoint(text)}
                onSubmitEditing={() => ref2.current.focus()}
            />
            <TextInput
                ref={ref2}
                placeholder="Enter destination point"
                value={destination}
                onChangeText={(text) => setDestinationPoint(text)}
                onSubmitEditing={() => alert(`Route Entered`)}
            />
            
            <Text style={styles.label}>Select an option:</Text>
            {Platform.OS === 'android' ? (
                <TouchableOpacity onPress={() => pickerRef.current.togglePicker()}>
                    <Picker
                        ref={pickerRef}
                        onValueChange={handlePickerSelect}
                        items={modeDropdownData}
                        placeholder={{ label: "Choose an option...", value: null }}
                        useNativeAndroidPickerStyle={false}
                        style={pickerSelectStyles}
                        doneText="Done"
                    />
                </TouchableOpacity>
            ) : (
                <>
                    <TouchableOpacity onPress={() => actionSheetRef.current.show()}>
                        <Text style={styles.label}>Choose an option...</Text>
                    </TouchableOpacity>
                    <ActionSheet
                        ref={actionSheetRef}
                        title={'Select Mode'}
                        options={modeDropdownData.map(item => item.label).concat('Cancel')}
                        cancelButtonIndex={modeDropdownData.length}
                        onPress={(index) => {
                            if (index !== modeDropdownData.length) {
                                handlePickerSelect(modeDropdownData[index].value);
                            }
                        }}
                    />
                </>
            )}
            {selectedMode && <Text style={styles.selected}>Selected: {selectedMode}</Text>}

            <TouchableOpacity style={styles.TouchableOpacity}
                onPress={isFormValid ? fetchRoutes : null}
                color="#841584">
                {/* activeOpacity={isFormValid ? 0.7 : 1} */}
                <Text>Search</Text>
            </TouchableOpacity>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        marginBottom: 10,
    },
    label: {
        marginBottom: 10,
    },
    selected: {
        marginTop: 10,
        marginBottom: 10,
    },
    TouchableOpacity: {
        padding: 10,
        backgroundColor: '#841584',
        borderRadius: 5,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        color: 'black',
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        backgroundColor: 'white',
        width: '100%',
    },
    inputAndroid: {
        color: 'black',
        width: '80%',
    },
});