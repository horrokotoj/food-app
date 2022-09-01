import { useState, useRef, useContext } from 'react';
import {
  Keyboard,
  TouchableWithoutFeedback,
  View,
  KeyboardAvoidingView,
  Text,
} from 'react-native';
import { TextInput, HelperText, Button } from 'react-native-paper';
import { styleSheet } from '../styleSheets/StyleSheet';
import { AuthContext } from '../context/AuthContext';

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [secureEntry, setSecureEntry] = useState(true);

  const passwordRef = useRef();
  const passwordConfirmRef = useRef();

  const { signUp } = useContext(AuthContext);

  const hasErrors = () => {
    return !(password === passwordConfirm);
  };

  const handleSignup = () => {
    let tmp_username = username;
    if (password === passwordConfirm) {
      let tmp_password = password;
      setUsername('');
      setPassword('');
      signUp(tmp_username, tmp_password);
    } else {
      alert('Please reenter same password');
    }
  };

  console.log('In landing screen');

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
                passwordConfirmRef.current.focus();
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
                passwordConfirmRef.current.focus();
              }}
            />
          )}
          {secureEntry ? (
            <TextInput
              style={styleSheet.input}
              mode='outlined'
              secureTextEntry
              label='Reenter password'
              value={passwordConfirm}
              right={
                <TextInput.Icon
                  name='eye'
                  onPress={() => {
                    setSecureEntry(!secureEntry);
                  }}
                />
              }
              onChangeText={setPasswordConfirm}
              ref={passwordConfirmRef}
              onSubmitEditing={() => {
                handleSignup();
              }}
            />
          ) : (
            <TextInput
              style={styleSheet.input}
              mode='outlined'
              autoCapitalize='none'
              label='Reenter password'
              value={passwordConfirm}
              right={
                <TextInput.Icon
                  name='eye'
                  onPress={() => {
                    setSecureEntry(!secureEntry);
                  }}
                />
              }
              onChangeText={setPasswordConfirm}
              ref={passwordConfirmRef}
              onSubmitEditing={() => {
                handleSignup();
              }}
            />
          )}
          <HelperText type='error' visible={hasErrors()}>
            Reentered password not the same as password
          </HelperText>
          <Button
            icon='login'
            mode='contained'
            labelStyle={styleSheet.buttonLabelStyle}
            style={styleSheet.button}
            onPress={() => {
              handleSignup();
            }}
          >
            Sign up
          </Button>
          <Button
            icon='arrow-left'
            mode='contained'
            labelStyle={styleSheet.buttonLabelStyle}
            style={styleSheet.button}
            onPress={() => {
              navigation.goBack();
            }}
          >
            Back
          </Button>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SignupScreen;
