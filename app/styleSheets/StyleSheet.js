import { StyleSheet } from 'react-native';

export const styleSheet = StyleSheet.create({
	appContainer: {
		flex: 1,
		backgroundColor: '#fff',
	},
	container: {
		flex: 1,
		backgroundColor: '#fff',
		justifyContent: 'center',
	},
	logoContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	logoText: {
		fontSize: 50,
	},
	inputContainer: {
		flex: 2,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
	},
	input: {
		margin: 5,
		width: 250,
	},
	button: {
		margin: 5,
		justifyContent: 'center',
	},
	buttonLabelStyle: {
		fontSize: 15,
	},
	recipeImage: {
		width: 50,
		height: 50,
		borderRadius: 25,
	},
});
