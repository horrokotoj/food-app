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
	saveButton: {
		position: 'absolute',
		top: 60,
		right: 5,
		height: 60,
		zIndex: 1,
		borderRadius: 50,
		justifyContent: 'center',
	},
	saveButtonLabelStyle: {
		fontSize: 25,
		alignItems: 'center',
	},
	recipeImage: {
		width: 50,
		height: 50,
		borderRadius: 25,
	},
	recipeTitle: { marginTop: 15 },
	recipeInputContainerContainer: {
		flexDirection: 'column',
		width: '100%',
	},
	recipeInputContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginLeft: 15,
		marginRight: '2%',
	},
	pencilContainer: {
		flex: 1,
		flexDirection: 'row-reverse',
	},
	recipeInput: {
		width: '66%',
	},
	recipeAdd: {
		width: '50%',
	},
	recipeQuant: {
		marginLeft: 10,
		width: '20%',
	},
	recipeStepInputTitle: {
		width: '5%',
	},
	closeButton: {
		justifyContent: 'center',
		width: '10%',
		margin: 0,
	},
	closeButtonLabelStyle: {
		fontSize: 35,
	},
	closeButtonContentStyle: {
		alignText: 'center',
	},
	addButton: {
		justifyContent: 'center',
		marginTop: 5,
	},
	addButtonLabelStyle: {
		fontSize: 35,
	},
});
