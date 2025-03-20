import { Platform } from 'react-native';
import { storeData, retrieveData, removeData, updateData } from "./caching";

export const postConnection = async (url, payload) => {
    try {
        const baseUrl = Platform.OS === 'web'
            ? 'http://localhost:8000'
            : process.env.EXPO_PUBLIC_API_URL;
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
    }
}

export const handleLogin = async (username, password, navigation) => {
    if (username == '' || password == '') {
        alert("All fields have to be filled before logging in!")
    }
    else {
        console.log('username: ', username)
        console.log('password: ', password)
        navigation.navigate("Map")

        url = "login"
        payload = { username: username, password: password }
        
        // Await response and print message from server
        const data = await postConnection(url, payload);
        alert(data.message)
        
        if (data.message === `Login successful for user: ${username}`) {
            if (retrieveData("username") !== null) {
                await removeData("username");
                await updateData("username", username);
            }
            else {
                await storeData("username", username)
            }
        }

        // if the data is "success", then cache details
        console.log('Server response:', data);
    }
};


export const handleSignup = async (username, password, navigation) => {
    if (username == '' || password == '') {
        alert("All fields have to be filled before signing up!")
    }
    else {
        console.log('username: ', username)
        console.log('password: ', password)
        navigation.navigate("Map")

        url = "signup"
        payload = { username: username, password: password }

        // Await response and print message from server
        const data = await postConnection(url, payload);
        alert(data.message)

        if (data.message === `Signup successful for user: ${username}`) {
            if (retrieveData("username") !== null) {
                await removeData("username");
                await updateData("username", username);
            }
            else {
                await storeData("username", username);
            }
        }

        console.log('Server response:', data);
    }
};
