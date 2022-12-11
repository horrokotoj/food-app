import { useContext } from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { AccessTokenContext } from '../context/AccessTokenContext';
import { styleSheet } from '../styleSheets/StyleSheet';

const HomeScreen = () => {
	const { signOut } = useContext(AuthContext);
	const accessToken = useContext(AccessTokenContext);

	return (
		<View style={styleSheet.container}>
			<Text>HomeScreen</Text>
			<Button
				mode='contained'
				labelStyle={styleSheet.buttonLabelStyle}
				style={styleSheet.button}
				onPress={() => {
					signOut(accessToken);
				}}
			>
				Signout
			</Button>
		</View>
	);
};

export default HomeScreen;
