import { useState, useReducer, useEffect, useMemo, useContext } from 'react';

import * as SecureStore from 'expo-secure-store';
import { NavigationContainer } from '@react-navigation/native';

import { AuthContext } from '../context/AuthContext';
import { UsernameContext } from '../context/UsernameContext';
import { AccessTokenContext } from '../context/AccessTokenContext';
import { NetworkContext } from '../context/NetworkContext';
import { InitialDateContext } from '../context/InitialDateContext';
import { SetInitialDateContext } from '../context/SetInitialDateContext';

import AuthNavigator from './AuthNavigator';
import DrawerNavigator from './DrawerNavigator';

import LoadingScreen from '../screens/LoadingScreen';

import LoginRequest from '../network/LoginRequest';
import SignupRequest from '../network/SignupRequest';
import SignoutRequest from '../network/SignoutRequest';
import RefreshToken from '../network/RefreshToken';

import Request from '../network/Request';

import moment from 'moment';

export default function Navigator() {
	const [loading, setLoading] = useState(false);
	const [accessToken, setAccessToken] = useState('');
	const [username, setUsername] = useState('');
	const [initialDate, setInitialDate] = useState(moment().format('YYYY-MM-DD'));

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

	const refreshAccessToken = async () => {
		let refreshToken = await SecureStore.getItemAsync('refreshToken');
		if (refreshToken) {
			let response = await RefreshToken(refreshToken);
			console.log(response);
			if (response.token) {
				setAccessToken(response.token);
				return response.token;
			}
		}
		return null;
	};

	useEffect(() => {
		// Fetch the token from storage then navigate to our appropriate place
		const bootstrapAsync = async () => {
			setLoading(true);
			let refreshToken = null;
			let username = null;

			try {
				refreshToken = await SecureStore.getItemAsync('refreshToken');
				usernameStringified = await SecureStore.getItemAsync('username');
				console.log(refreshToken);
				console.log(usernameStringified);
				console.log('Result in bootstrap');
				if (refreshToken && usernameStringified) {
					setUsername(JSON.parse(usernameStringified));
					let response = await RefreshToken(refreshToken);
					if (response.token) {
						setAccessToken(response.token);
						dispatch({ type: 'RESTORE_TOKEN', isSignout: false });
					} else {
						alert('Failed to refresh accessToken');
						dispatch({ type: 'SIGN_OUT' });
					}
				}
			} catch (e) {
				// Restoring token failed
				console.log(e);
			}
			setLoading(false);

			// After restoring token, we may need to validate it in production apps

			// This will switch to the App screen or Auth screen and this loading
			// screen will be unmounted and thrown away.
		};

		bootstrapAsync();
	}, []);

	const authContext = useMemo(
		() => ({
			signIn: async (loginUsername, password) => {
				setLoading(true);
				let response = null;
				try {
					response = await LoginRequest(loginUsername, password);
					if (response) {
						console.log(response);
						let newRefreshToken = response.refreshToken;
						let newAccessToken = response.accessToken;
						console.log(response.user.email);
						await SecureStore.setItemAsync('refreshToken', newRefreshToken);
						await SecureStore.setItemAsync(
							'username',
							JSON.stringify(response.user)
						);
						setAccessToken(newAccessToken);
						setUsername(response.user);
						dispatch({ type: 'SIGN_IN' });
					}
					//await login request
				} catch (e) {
					console.log(e);
				}
				setLoading(false);
			},
			signOut: async (token) => {
				let responseStatusCode = null;
				try {
					console.log('AccessToken');
					console.log(token);
					responseStatusCode = await SignoutRequest(token);
					while (responseStatusCode !== 200) {
						if (responseStatusCode === 403) {
							console.log('accessToken not autharized');
							let refreshToken = await SecureStore.getItemAsync('refreshToken');
							if (refreshToken) {
								let response = await RefreshToken(refreshToken);
								if (response) {
									setAccessToken(response.token);
									responseStatusCode = await SignoutRequest(response.token);
								} else {
									alert('Server error, signing out without removing token');
									break;
								}
							}
						} else {
							alert('Server error, signing out without removing token');
							break;
						}
					}
					setAccessToken('');
					setUsername('');
					await SecureStore.deleteItemAsync('refreshToken');
					await SecureStore.deleteItemAsync('username');
					dispatch({ type: 'SIGN_OUT' });
					return true;
				} catch {
					console.log(err);
				}
			},
			signUp: async (signupUsername, email, password) => {
				console.log('signUp');
				console.log(signupUsername);
				console.log(password);
				setLoading(true);
				try {
					let response = await SignupRequest(signupUsername, email, password);
					console.log(response);
					if (response === 200) {
						console.log('register successfull');
						alert('Please verify your account via your email before you login');
					} else if (response === 409) {
						console.log('register unsuccessfull');
						alert('Username or email already in use');
					} else {
						console.log('register unsuccessfull');
						alert('Unknown failure');
					}
				} catch (e) {
					console.log(e);
				}
				setLoading(false);
			},
		}),
		[]
	);

	const networkContext = useMemo(
		() => ({
			refreshAccessToken: async () => {
				let refreshToken = await SecureStore.getItemAsync('refreshToken');
				if (refreshToken) {
					let response = await RefreshToken(refreshToken);
					if (response) {
						setAccessToken(response.token);
					}
				}
			},
			request: async (accessToken, bodyObj, endpoint, type) => {
				let response;
				try {
					response = await Request(accessToken, bodyObj, endpoint, type);
					if (response === 403) {
						let maybeAccessToken = await refreshAccessToken();
						if (maybeAccessToken) {
							let newResponse = await Request(
								maybeAccessToken,
								bodyObj,
								endpoint,
								type
							);
							if (newResponse === 403) {
								alert('Request with new token failed due to invalid token');
								return false;
							} else if (newResponse) {
								return newResponse;
							} else {
								alert('Request with new token failed');
								return false;
							}
						} else {
							alert('Unable to refresh access token');
							signOut();
						}
					}
					if (response === 500) {
						return false;
					}
					if (response) {
						return response;
					}
					return false;
				} catch (err) {
					console.log(err);
				}
			},
		}),
		[]
	);

	if (loading) {
		return <LoadingScreen />;
	}

	function chooseNav() {
		console.log('chooseNav');
		console.log(userState);
		if (userState.isSignout == true) {
			return <AuthNavigator />;
		} else {
			return <DrawerNavigator />;
		}
	}

	return (
		<AuthContext.Provider value={authContext}>
			<UsernameContext.Provider value={username}>
				<AccessTokenContext.Provider value={accessToken}>
					<NetworkContext.Provider value={networkContext}>
						<InitialDateContext.Provider value={initialDate}>
							<SetInitialDateContext.Provider value={setInitialDate}>
								<NavigationContainer>{chooseNav()}</NavigationContainer>
							</SetInitialDateContext.Provider>
						</InitialDateContext.Provider>
					</NetworkContext.Provider>
				</AccessTokenContext.Provider>
			</UsernameContext.Provider>
		</AuthContext.Provider>
	);
}
