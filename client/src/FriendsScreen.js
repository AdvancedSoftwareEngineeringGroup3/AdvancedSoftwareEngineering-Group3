/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Platform,
  ImageBackground,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import styles from './components/styles/FriendsScreen.styles';
import beachBackground from './assets/FriendsUI/BeachBackground.png'; // Import your background image
import { retrieveData } from './caching';

// Not logged in message component
function NotLoggedInMessage() {
  return (
    <View
      style={[
        styles.container,
        { justifyContent: 'center', alignItems: 'center', padding: 20 },
      ]}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 10,
          textAlign: 'center',
        }}
      >
        You are not logged in
      </Text>
      <Text style={{ fontSize: 16, textAlign: 'center' }}>
        Please login to access friends dashboard.
      </Text>
    </View>
  );
}

// Loading component
function LoadingIndicator() {
  return (
    <View
      style={[
        styles.container,
        { justifyContent: 'center', alignItems: 'center' },
      ]}
    >
      <Text style={{ fontSize: 16 }}>Loading friends dashboard...</Text>
    </View>
  );
}

export default function FriendsScreen() {
  const [username, setUsername] = useState(''); // Username of the person sending the request
  const [isLoading, setIsLoading] = useState(true);
  const [friendRequestName, setFriendName] = useState('');
  const [pendingFriends, setPendingFriends] = useState([]);
  const [currentFriends, setCurrentFriends] = useState([]);
  const [sentFriends, setSentFriends] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line no-use-before-define
    fetchUserAndFriends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserAndFriends = async () => {
    try {
      const retrievedUsername = await retrieveData('username');
      setUsername(retrievedUsername || '');

      if (retrievedUsername && retrievedUsername !== '') {
        // Fetch the friend requests and friends list
        await pollFriendRequests(retrievedUsername);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setIsLoading(false);
    }
  };

  // Function to send a friend request
  const sendFriendRequest = async () => {
    try {
      // send friend request name & username of the person sending friend request
      const payload = {
        receiver: friendRequestName,
        sender: username, // username of the person sending friend request
      };

      const baseUrl =
        Platform.OS === 'web'
          ? 'http://localhost'
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

  const pollFriendRequests = async (senderName) => {
    try {
      const baseUrl =
        Platform.OS === 'web'
          ? 'http://localhost'
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
    // Only set up polling if the user is logged in
    if (!username || username === '') {
      return () => {}; // Return empty cleanup function if not logged in
    }

    // Initial poll
    pollFriendRequests(username);

    const intervalId = setInterval(() => {
      pollFriendRequests(username);
    }, 5000); // Poll every 5 seconds

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [username]); // Re-run if username changes

  // Function to accept a friend request
  const processFriendRequest = async (friend, answer) => {
    try {
      // send friend request name & username of the person sending friend request
      const payload = {
        requester: friend,
        user: username,
        answer,
      };

      const baseUrl =
        Platform.OS === 'web'
          ? 'http://localhost'
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
        if (answer) {
          setCurrentFriends([...currentFriends, friend]);
        }
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
        user: username, // username of the person removing friend
        friend, // friend to be removed
      };

      const baseUrl =
        Platform.OS === 'web'
          ? 'http://localhost'
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
        user: username, // username of the person removing friend
        friend, // friend to be removed
      };

      const baseUrl =
        Platform.OS === 'web'
          ? 'http://localhost'
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

  // If still loading, show loading indicator
  if (isLoading) {
    return <LoadingIndicator />;
  }

  // If not logged in (username is empty), show not logged in message
  if (!username || username === '') {
    return <NotLoggedInMessage />;
  }

  // Otherwise, show the normal friends dashboard
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Background Image */}
      <ImageBackground
        source={beachBackground} // Set the background image
        style={styles.backgroundImage} // Apply styles to stretch the image
        resizeMode="cover" // Ensure the image covers the entire screen
      >
        <View style={styles.container}>
          {/* Top Section: Input & Button */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter friend's name"
              value={friendRequestName}
              onChangeText={setFriendName}
            />
            <Button
              title="Send Request"
              onPress={sendFriendRequest}
              style={styles.requestButton}
            />
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
      </ImageBackground>
    </GestureHandlerRootView>
  );
}
