import { useState, useRef, useContext } from 'react';
import {
  Keyboard,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
  Text,
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { styleSheet } from '../styleSheets/StyleSheet';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureEntry, setSecureEntry] = useState(true);

  const passwordRef = useRef();

  const { signIn } = useContext(AuthContext);

  const handleSignin = () => {
    let tmp_username = username;
    let tmp_password = password;
    setUsername('');
    setPassword('');
    signIn(tmp_username, tmp_password);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styleSheet.container}>
        <View style={styleSheet.logoContainer}>
          <Text style={styleSheet.logoText}>Food</Text>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={styleSheet.inputContainer}
        >
          <TextInput
            style={styleSheet.input}
            mode='outlined'
            label='Username'
            autoCapitalize='none'
            value={username}
            onChangeText={setUsername}
            returnKeyType='next'
            onSubmitEditing={() => {
              passwordRef.current.focus();
            }}
          />
          {secureEntry ? (
            <TextInput
              style={styleSheet.input}
              mode='outlined'
              secureTextEntry
              label='Password'
              value={password}
              right={
                <TextInput.Icon
                  name='eye'
                  onPress={() => {
                    setSecureEntry(!secureEntry);
                  }}
                />
              }
              onChangeText={setPassword}
              ref={passwordRef}
              onSubmitEditing={() => {
                handleSignin();
              }}
            />
          ) : (
            <TextInput
              style={styleSheet.input}
              mode='outlined'
              autoCapitalize='none'
              label='Password'
              value={password}
              right={
                <TextInput.Icon
                  name='eye'
                  onPress={() => {
                    setSecureEntry(!secureEntry);
                  }}
                />
              }
              onChangeText={setPassword}
              ref={passwordRef}
              onSubmitEditing={() => {
                handleSignin();
              }}
            />
          )}

          <Button
            icon='login'
            mode='contained'
            labelStyle={styleSheet.buttonLabelStyle}
            style={styleSheet.button}
            onPress={() => {
              handleSignin();
            }}
          >
            Log in
          </Button>
          <Button
            icon='note-text'
            mode='contained'
            labelStyle={styleSheet.buttonLabelStyle}
            style={styleSheet.button}
            onPress={() => {
              navigation.navigate('SignupScreen');
            }}
          >
            Sign up
          </Button>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
