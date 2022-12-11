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
	calendarButtonsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
		marginTop: 20,
		marginBottom: 5,
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
	calendarRecipeView: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	listContentView: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	listEditView: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 10,
	},
	recipeTouchable: { width: '70%' },
	listTouchable: {
		width: '70%',
		flexDirection: 'row',
		alignItems: 'center',
	},
	appbarHeader: { backgroundColor: 'dodgerblue' },
	button: {
		margin: 5,
		justifyContent: 'center',
		backgroundColor: 'dodgerblue',
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
		width: '88%',
	},
	recipeQuant: {
		width: '50%',
	},
	recipeStepInputTitle: {
		width: '5%',
	},
	recipeStep: {
		width: '15%',
	},
	recipeStepDesc: {
		width: '45%',
		marginLeft: 10,
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
	editPortionsButton: {
		backgroundColor: 'dodgerblue',
		width: '40%',
		borderRadius: 25,
	},
	editPortionsButtonLabelStyle: {
		fontSize: 15,
		padding: 5,
		color: 'black',
	},
	addMealButton: {
		backgroundColor: 'dodgerblue',
		width: '40%',
		borderRadius: 25,
	},
	addMealButtonLabelStyle: {
		fontSize: 15,
		padding: 10,
		color: 'black',
	},
	addRecipeButton: {
		flexDirection: 'row-reverse',
	},
	addRecipeButtonLabelStyle: {
		fontSize: 50,
		color: 'dodgerblue',
	},
	addButton: {
		justifyContent: 'center',
		marginTop: 5,
	},
	deleteButton: {
		marginTop: 5,
	},
	addButtonLabelStyle: {
		fontSize: 35,
		color: 'dodgerblue',
	},
	deleteButtonLabelStyle: {
		fontSize: 35,
		color: 'red',
	},
	ingredientsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
	ingredientChip: {
		borderRadius: 10,
		margin: 3,
		backgroundColor: 'rgb(255, 219, 209)',
	},
	modalStyle: { marginBottom: '40%' },
	modalContainerStyle: {
		backgroundColor: 'white',
		padding: 20,
		marginLeft: '10%',
		marginRight: '10%',
	},
	calendarPortionsInput: {
		width: '50%',
		alignSelf: 'center',
	},
});
