import { useState, useReducer, useEffect, useMemo, useContext } from 'react';

import * as SecureStore from 'expo-secure-store';
import { NavigationContainer } from '@react-navigation/native';

import { AuthContext } from '../context/AuthContext';
import { UsernameContext } from '../context/UsernameContext';
import { AccessTokenContext } from '../context/AccessTokenContext';
import { NetworkContext } from '../context/NetworkContext';

import AuthNavigator from './AuthNavigator';
import DrawerNavigator from './DrawerNavigator';

import LoadingScreen from '../screens/LoadingScreen';
import LandingScreen from '../screens/LandingScreen';

import LoginRequest from '../network/LoginRequest';
import SignupRequest from '../network/SignupRequest';
import SignoutRequest from '../network/SignoutRequest';
import RefreshToken from '../network/RefreshToken';
import GetRecipes from '../network/GetRecipes';

export default function Navigator() {
	const [loading, setLoading] = useState(false);
	const [accessToken, setAccessToken] = useState('');
	const [username, setUsername] = useState('');

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
				username = await SecureStore.getItemAsync('username');
				console.log(refreshToken);
				console.log(username);
				console.log('Result in bootstrap');
				if (refreshToken && username) {
					setUsername(username);
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
						await SecureStore.setItemAsync('refreshToken', newRefreshToken);
						await SecureStore.setItemAsync('username', loginUsername);
						setAccessToken(newAccessToken);
						setUsername(loginUsername);
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
			signUp: async (signupUsername, password) => {
				console.log('signUp');
				console.log(signupUsername);
				console.log(password);
				setLoading(true);
				let response = null;
				try {
					let response = await SignupRequest(signupUsername, password);
					if (response === 200) {
						console.log('register successfull');
						response = await LoginRequest(signupUsername, password);
						if (response) {
							let newRefreshToken = response.refreshToken;
							let newAccessToken = response.accessToken;
							await SecureStore.setItemAsync('refreshToken', newRefreshToken);
							await SecureStore.setItemAsync('username', signupUsername);
							setAccessToken(newAccessToken);
							setUsername(signupUsername);
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

	const networkContext = useMemo(
		() => ({
			refreshAccessToken: async () => {
				let refreshToken = await SecureStore.getItemAsync('refreshToken');
				if (refreshToken) {
					let response = await RefreshToken(refreshToken);
					console.log(response);
					if (response) {
						setAccessToken(response.token);
					}
				}
			},
			getRecipes: async (accessToken) => {
				let response;
				try {
					response = await GetRecipes(accessToken);
					if (response === 403) {
						let maybeAccessToken = await refreshAccessToken();
						if (maybeAccessToken) {
							let newResponse = await GetRecipes(maybeAccessToken);
							if (newResponse === 500) {
								alert('Unable to refresh access token');
							} else if (newResponse) {
								return newResponse;
							}
						}
					}
					if (response === 500) {
						return null;
					}
					if (response) {
						return response;
					}
					return null;
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
						<NavigationContainer>{chooseNav()}</NavigationContainer>
					</NetworkContext.Provider>
				</AccessTokenContext.Provider>
			</UsernameContext.Provider>
		</AuthContext.Provider>
	);
}
