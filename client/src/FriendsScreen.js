import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import styles from './components/styles/FriendsScreen.styles';

export default function FriendsScreen() {
  const [friendRequestName, setFriendName] = useState('');
  const [pendingFriends, setPendingFriends] = useState([]);
  const [currentFriends, setCurrentFriends] = useState([]);
  const [sentFriends, setSentFriends] = useState([]);

  // Commented for future use
  //  const [senderName, setSenderName] = useState('');

  const senderName = 'Conor'; // Username of the person sending the request

  // friend_list
  // pending_friends

  // Function to send a friend request
  const sendFriendRequest = async () => {
    try {
      // send friend request name & username of the person sending friend request
      const payload = {
        receiver: friendRequestName,
        sender: senderName, // username of the person sending friend request
      };

      const baseUrl =
        Platform.OS === 'web'
          ? 'http://localhost:8000'
          : process.env.EXPO_PUBLIC_API_URL;
      console.log(`Sending request to ${baseUrl}/send_request`);

      const response = await fetch(`${baseUrl}/send_request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Check if the response is ok
      if (response.ok) {
        // Parse the response as JSON
        const serverMessage = await response.json();
        console.log('Response from Server: ', serverMessage.message);

        alert(serverMessage.message);
        setSentFriends([...sentFriends, friendRequestName.trim()]);
        setFriendName('');
      } else {
        // Log the raw response text for debugging
        const responseText = await response.text();
        console.error('Failed to send friend request:', responseText);
        alert('Server Error: ', responseText);
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const Poll = async () => {
    try {
      // send friend request name & username of the person sending friend request
      // const payload = {
      // sender: "Conor", // username of the person sending friend request
      // };

      const baseUrl =
        Platform.OS === 'web'
          ? 'http://localhost:8000'
          : process.env.EXPO_PUBLIC_API_URL;
      console.log(
        `Sending request to ${baseUrl}/check_requests?sender=${senderName}`,
      );

      const response = await fetch(
        `${baseUrl}/check_requests?sender=${senderName}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      // Check if the response is ok
      if (response.ok) {
        // Parse the response as JSON
        const serverMessage = await response.json();
        console.log('Response from Server: ', serverMessage.message);

        // alert(server_message.message);
        setPendingFriends(serverMessage.pending_friends);
        setCurrentFriends(serverMessage.friends);
        setSentFriends(serverMessage.sent_friends);
      } else {
        // Log the raw response text for debugging
        const responseText = await response.text();
        console.error('Failed to get friend requests:', responseText);
        alert('Server Error: ', responseText);
      }
    } catch (error) {
      console.error('Error getting pending friend requests:', error);
    }
  };

  // Poll for friend requests every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      Poll();
    }, 5000); // Poll every 5 seconds

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  // Function to accept a friend request
  const processFriendRequest = async (friend, answer) => {
    // setCurrentFriends([...currentFriends, friend]);

    try {
      // send friend request name & username of the person sending friend request
      const payload = {
        requester: friend,
        user: senderName,
        answer,
      };

      const baseUrl =
        Platform.OS === 'web'
          ? 'http://localhost:8000'
          : process.env.EXPO_PUBLIC_API_URL;
      console.log(`Sending request to ${baseUrl}/request_response`);

      const response = await fetch(`${baseUrl}/request_response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Check if the response is ok
      if (response.ok) {
        // Parse the response as JSON
        const serverMessage = await response.json();
        console.log('Response from Server: ', serverMessage.message);

        alert(serverMessage.message);
        setPendingFriends(pendingFriends.filter((name) => name !== friend));
        setCurrentFriends(currentFriends.filter((name) => name !== friend));
      } else {
        // Log the raw response text for debugging
        const responseText = await response.text();
        console.error('Failed to accept friend request:', responseText);
        alert('Server Error: ', responseText);
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  // Function to cancel a sent friend request
  const cancelFriendRequest = async (friend) => {
    try {
      // send friend request name & username of the person sending friend request
      const payload = {
        user: senderName, // username of the person removing friend
        friend, // friend to be removed
      };

      const baseUrl =
        Platform.OS === 'web'
          ? 'http://localhost:8000'
          : process.env.EXPO_PUBLIC_API_URL;
      console.log(`Sending request to ${baseUrl}/cancel_friend_request`);

      const response = await fetch(`${baseUrl}/cancel_friend_request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Check if the response is ok
      if (response.ok) {
        // Parse the response as JSON
        const serverMessage = await response.json();
        console.log('Response from Server: ', serverMessage.message);

        alert(serverMessage.message);
        setSentFriends(sentFriends.filter((name) => name !== friend));
      } else {
        // Log the raw response text for debugging
        const responseText = await response.text();
        console.error('Failed to send friend request:', responseText);
        alert('Server Error: ', responseText);
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  // Function to remove an existing friend
  const removeFriend = async (friend) => {
    try {
      // send friend request name & username of the person sending friend request
      const payload = {
        user: senderName, // username of the person removing friend
        friend, // friend to be removed
      };

      const baseUrl =
        Platform.OS === 'web'
          ? 'http://localhost:8000'
          : process.env.EXPO_PUBLIC_API_URL;
      console.log(`Sending request to ${baseUrl}/remove_friend`);

      const response = await fetch(`${baseUrl}/remove_friend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // Check if the response is ok
      if (response.ok) {
        // Parse the response as JSON
        const serverMessage = await response.json();
        console.log('Response from Server: ', serverMessage.message);

        alert(serverMessage.message);
        setCurrentFriends(currentFriends.filter((name) => name !== friend));
      } else {
        // Log the raw response text for debugging
        const responseText = await response.text();
        console.error('Failed to send friend request:', responseText);
        alert('Server Error: ', responseText);
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Top Section: Input & Button */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter friend's name"
            value={friendRequestName}
            onChangeText={setFriendName}
          />
          <Button title="Send Request" onPress={sendFriendRequest} />
        </View>

        {/* Sent Friend Requests */}
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Sent Friend Requests</Text>
          <FlatList
            data={sentFriends}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.pendingItem}>
                <Text style={styles.friendRequestName}>{item}</Text>
                {/* Cancel friend request */}
                <TouchableOpacity
                  onPress={() => cancelFriendRequest(item)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        {/* Pending Friends List */}
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Pending Friend Requests</Text>
          <FlatList
            onPress={() => Poll()}
            data={pendingFriends}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.pendingItem}>
                <Text style={styles.friendRequestName}>{item}</Text>
                <TouchableOpacity
                  onPress={() => processFriendRequest(item, true)}
                  style={styles.acceptButton}
                >
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => processFriendRequest(item, false)}
                  style={styles.rejectButton}
                >
                  <Text style={styles.buttonText}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        {/* Current Friends List */}
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Current Friends</Text>
          <FlatList
            data={currentFriends}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.friendItem}>
                <Text style={styles.friendRequestName}>{item}</Text>
                {/* Remove friend */}
                <TouchableOpacity
                  onPress={() => removeFriend(item)}
                  style={styles.removeButton}
                >
                  <Text style={styles.buttonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>
    </GestureHandlerRootView>
  );
}
