import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function FriendsScreen() {
  const [senderName, setSenderName] = useState('')
  const [friendRequestName, setFriendName] = useState('');
  const [pendingFriends, setPendingFriends] = useState([]);
  const [currentFriends, setCurrentFriends] = useState([]);

  // friend_list
  // pending_friends

  // Function to send a friend request
  const sendFriendRequest = async () => {
    try{
      // send friend request name & username of the person sending friend request
      const payload = {
        receiver: friendRequestName,
        sender: "Conor",
      };

        const baseUrl = Platform.OS === 'web'
            ? 'http://localhost:8000'
            : process.env.EXPO_PUBLIC_API_URL;
        console.log(`Sending request to ${baseUrl}/send_request`);

        const response = await fetch(`${baseUrl}/send_request`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application.json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          setPendingFriends([...pendingFriends, friendRequestName.trim()]);
          setFriendName('');
        } else {
          console.error('Failed to send friend request');
        }
      } catch (error) {
        console.error('Error sending friend request:', error);
      }
  };

    // Function to send a friend request
    const sendFriendRequest1 = () => {
      if (friendRequestName.trim() !== '') {
        setPendingFriends([...pendingFriends, friendRequestName.trim()]);
        setFriendName('');
      }
    };

  // Function to accept a friend request
  const acceptFriendRequest = (friend) => {
    setPendingFriends(pendingFriends.filter((name) => name !== friend));
    setCurrentFriends([...currentFriends, friend]);
  };

  // Function to reject a friend request
  const rejectFriendRequest = (friend) => {
    setPendingFriends(pendingFriends.filter((name) => name !== friend));
    
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

        {/* Pending Friends List */}
        <View style={styles.listContainer}>
          <Text style={styles.sectionTitle}>Pending Friend Requests</Text>
          <FlatList
            data={pendingFriends}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.pendingItem}>
                <Text style={styles.friendRequestName}>{item}</Text>
                <TouchableOpacity onPress={() => acceptFriendRequest(item)} style={styles.acceptButton}>
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => rejectFriendRequest(item)} style={styles.rejectButton}>
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
              </View>
            )}
          />
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  listContainer: {
    flex: 1,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pendingItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  friendItem: {
    backgroundColor: '#d1f0d1',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  friendRequestName: {
    fontSize: 16,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
    marginLeft: 5,
  },
  rejectButton: {
    backgroundColor: '#E74C3C',
    padding: 8,
    borderRadius: 5,
    marginLeft: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});