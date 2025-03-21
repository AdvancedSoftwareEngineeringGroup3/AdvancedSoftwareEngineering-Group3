import { Platform } from 'react-native';
import { storeData, retrieveData, removeData, updateData } from "../caching";

export const postConnection = async (url, payload, customBaseUrl=null) => {
    try {
        const baseUrl = customBaseUrl || (Platform.OS === 'web'
            ? 'http://localhost:8000'
            : process.env.EXPO_PUBLIC_API_URL);
        console.log(`Sending request to ${baseUrl}/${url}`);

        const response = await fetch(`${baseUrl}/${url}`, {
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
        alert(data.message);

        return data;
    } catch (error) {
        console.error('Error details:', error);
        throw error;
    }
};

export const handleLogin = async (username, password, navigation) => {
    if (username == '' || password == '') {
        alert("All fields have to be filled before logging in!");
    } else {
        console.log('username: ', username);
        console.log('password: ', password);
        navigation.navigate("Map");

        const url = "login";
        const payload = { username: username, password: password };

        const data = await postConnection(url, payload);
        alert(data.message);

        if (data.message === `Login successful for user: ${username}`) {
            if (retrieveData("username") !== null) {
                await removeData("username");
                await updateData("username", username);
            } else {
                await storeData("username", username);
            }
        }

        console.log('Server response:', data);
    }
};

export const handleSignup = async (username, password, navigation) => {
    if (username == '' || password == '') {
        alert("All fields have to be filled before signing up!");
    } else {
        console.log('username: ', username);
        console.log('password: ', password);
        navigation.navigate("Map");

        const url = "signup";
        const payload = { username: username, password: password };

        const data = await postConnection(url, payload);
        alert(data.message);

        if (data.message === `Signup successful for user: ${username}`) {
            if (retrieveData("username") !== null) {
                await removeData("username");
                await updateData("username", username);
            } else {
                await storeData("username", username);
            }
        }

        console.log('Server response:', data);
    }
};
