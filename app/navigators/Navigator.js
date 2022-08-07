import { useState, useReducer, useEffect, useMemo } from 'react';
import { View, Text } from 'react-native';

import * as SecureStore from 'expo-secure-store';
import { NavigationContainer } from '@react-navigation/native';

import LoadingScreen from '../screens/LoadingScreen';

import LoginRequest from '../network/LoginRequest';
import SignupRequest from '../network/SignupRequest';

export default function Navigator() {
  const [loading, setLoading] = useState(true);
  const [refreshToken, setRefreshToken] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [userName, setUserName] = useState('');

  /**
   * Inspired by https://reactnavigation.org/docs/auth-flow/
   */
  const [userState, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            isSignout: action.isSignout,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
          };
      }
    },
    {
      isSignout: true,
    }
  );

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      setLoading(true);
      let storedRefreshToken = null;
      let storedUserName = null;

      try {
        storedRefreshToken = await SecureStore.getItemAsync('refreshToken');
        storedUserName = await SecureStore.getItemAsync('userName');
        if (refreshToken && userName) {
          setRefreshToken(storedRefreshToken);
          setUserName(storedUserName);
          dispatch({ type: 'RESTORE_TOKEN', isSignout: false });
        }
      } catch (e) {
        // Restoring token failed
        console.log(e);
      }
      //setLoading(false);

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
    };

    bootstrapAsync();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async (loginUserName, password) => {
        setLoading(true);
        let response = null;
        try {
          response = await LoginRequest(loginUserName, password);
          if (response) {
            let newRefreshToken = response.refreshToken;
            let newAccessToken = response.accessToken;
            await SecureStore.setItemAsync('refreshToken', newRefreshToken);
            await SecureStore.setItemAsync('userName', loginUserName);
            setRefreshToken(newRefreshToken);
            setAccessToken(newAccessToken);
            setUserName(loginUserName);
            dispatch({ type: 'SIGN_IN' });
          }
          //await login request
        } catch (e) {
          console.log(e);
        }
        setLoading(false);
      },
      signOut: async () => {
        setRefreshToken('');
        setAccessToken('');
        setUserName('');
        await SecureStore.deleteItemAsync('refreshToken');
        await SecureStore.deleteItemAsync('userName');
        dispatch({ type: 'SIGN_OUT' });
      },
      signUp: async (signupUserName, password) => {
        console.log('signUp');
        console.log(mail);
        console.log(password);
        setLoading(true);
        let response = null;
        try {
          let response = await SignupRequest(signupUserName, password);
          if (response === 200) {
            console.log('register successfull');
            response = await LoginRequest(signupUserName, password);
            if (response) {
              let newRefreshToken = response.refreshToken;
              let newAccessToken = response.accessToken;
              await SecureStore.setItemAsync('refreshToken', newRefreshToken);
              await SecureStore.setItemAsync('userName', loginUserName);
              setRefreshToken(newRefreshToken);
              setAccessToken(newAccessToken);
              setUserName(loginUserName);
              dispatch({ type: 'SIGN_IN' });
            }
          } else {
            console.log('register unsuccessfull');
            alert('Register failed');
          }
        } catch (e) {
          console.log(e);
        }
        setLoading(false);
      },
    }),
    []
  );

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <NavigationContainer>
      <View>
        <Text>Navigator</Text>
      </View>
    </NavigationContainer>
  );
}
