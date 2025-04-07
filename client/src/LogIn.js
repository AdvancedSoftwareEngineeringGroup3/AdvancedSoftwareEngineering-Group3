import * as React from 'react';
import { useState } from 'react';
import {
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import { handleLogin } from './utils/accountUtils';
import styles from './components/styles/Login.styles';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const ref2 = React.useRef(null);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <SafeAreaView style={styles.container}>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
          style={styles.TextInput}
          onSubmitEditing={() => ref2.current.focus()}
        />
        <TextInput
          ref={ref2}
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          style={styles.TextInput}
        />
        <TouchableOpacity
          style={styles.TouchableOpacity}
          onPress={() => handleLogin(username, password, navigation)}
          color="#841584"
        >
          <Text style={styles.TouchableOpacityText}>Log In</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}
