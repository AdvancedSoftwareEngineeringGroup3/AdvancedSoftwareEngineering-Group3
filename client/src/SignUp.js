import * as React from 'react';
import { useState } from 'react';
import {
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import { handleSignup } from './utils/accountUtils';
import buttonStyles from './components/common/button';
import textInputStyles from './components/common/textInput';
import containerStyles from './components/common/commonContainer';

export default function SignUpScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const ref2 = React.useRef(null);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <SafeAreaView style={containerStyles.container}>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
          style={textInputStyles.textInput}
          onSubmitEditing={() => ref2.current.focus()}
        />

        <TextInput
          ref={ref2}
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          style={textInputStyles.textInput}
        />

        <TouchableOpacity
          style={buttonStyles.button}
          onPress={() =>
            handleSignup(username, password, navigation)
          }
          color="#841584"
        >
          <Text style={buttonStyles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}
