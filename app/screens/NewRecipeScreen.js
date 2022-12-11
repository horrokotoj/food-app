import { useState, useContext, useEffect, useCallback } from 'react';
import { ScrollView, View, KeyboardAvoidingView, Alert } from 'react-native';
import {
	Appbar,
	Menu,
	Provider,
	Card,
	Title,
	Paragraph,
	TextInput,
	Button,
	Portal,
	Modal,
	Text,
	IconButton,
} from 'react-native-paper';
import { styleSheet } from '../styleSheets/StyleSheet';

import { NetworkContext } from '../context/NetworkContext';
import { AccessTokenContext } from '../context/AccessTokenContext';
import { UsernameContext } from '../context/UsernameContext';

import NewRecipeDesc from '../components/NewRecipeDesc';
import NewRecipeIngredients from '../components/NewRecipeIngredients';
import NewRecipeSteps from '../components/NewRecipeSteps';
import NewPortions from '../components/NewPortions';

const NewRecipeScreen = ({ route, navigation }) => {
	const [recipeName, setRecipeName] = useState('');
	const [editName, setEditName] = useState('');
	const [newRecipeName, setNewRecipeName] = useState('');
	const [editImage, setEditImage] = useState(false);
	const [recipeImage, setRecipeImage] = useState('');
	const [newRecipeImage, setNewRecipeImage] = useState('');
	const [recipeDesc, setRecipeDesc] = useState(null);
	const [recipeIngredients, setRecipeIngredients] = useState([]);
	const [recipeSteps, setRecipeSteps] = useState([]);
	const [recipePortions, setRecipePortions] = useState(null);
	const [lookForError, setLookForError] = useState(false);

	const accessToken = useContext(AccessTokenContext);
	const { request } = useContext(NetworkContext);

	const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

	const postRecipe = async () => {
		if (
			recipeName &&
			recipeImage &&
			recipeDesc &&
			recipeIngredients &&
			recipeSteps &&
			recipePortions
		) {
			let bodyObj = {
				RecipeName: recipeName,
				RecipeImage: recipeImage,
				RecipeDesc: recipeDesc,
				RecipeIngredients: recipeIngredients,
				RecipeSteps: recipeSteps,
				RecipePortions: recipePortions,
			};
			let response = await request(
				accessToken,
				bodyObj,
				'entirerecipe',
				'POST'
			);
			if (response) {
				console.log('postRecipe');
				console.log(response);
				navigation.navigate('Recipes');
			} else {
				alert('Failed to post recipe');
			}
		} else {
			alert('Missing attributes');
			setLookForError(true);
		}
	};

	const confirmDone = () => {
		return Alert.alert('Recipe will be posted', '', [
			// The "Yes" button
			{
				text: 'Yes',
				onPress: async () => {
					postRecipe();
				},
			},
			// The "No" button
			// Does nothing but dismiss the dialog when tapped
			{
				text: 'No',
				onPress: () => {
					alert('no');
				},
			},
		]);
	};

	const handleSetRecipeImage = (recipeImage) => {
		setRecipeImage(newRecipeImage);
		setNewRecipeImage('');
		setEditImage(false);
	};

	const handleSetRecipeName = (recipeName) => {
		setRecipeName(newRecipeName);
		setNewRecipeName('');
		setEditName(false);
	};

	console.log('NewRecipeScreen');

	return (
		<Provider>
			<Appbar.Header style={styleSheet.appbarHeader}>
				<Appbar.BackAction
					onPress={() => {
						navigation.navigate('Recipes');
					}}
				/>

				<Appbar.Content
					title={recipeName ? recipeName : ''}
					onPress={() => {
						setEditName(!editName);
					}}
				/>
				{recipeImage.length > 0 && (
					<Appbar.Action
						icon={editImage ? 'image-off-outline' : 'image-edit-outline'}
						color='white'
						onPress={() => {
							setEditImage(!editImage);
						}}
					/>
				)}
				<Appbar.Action
					icon={'check-outline'}
					color='white'
					onPress={() => {
						confirmDone();
					}}
				/>
			</Appbar.Header>
			<ScrollView keyboardShouldPersistTaps={'handled'}>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : null}
				>
					<Card>
						{recipeImage.length > 0 && (
							<Card.Cover source={{ uri: recipeImage }} />
						)}
						<Card.Content>
							{(editName || recipeName.length === 0) && (
								<>
									<Title>Name: </Title>
									<View style={styleSheet.recipeInputContainer}>
										<TextInput
											style={styleSheet.recipeInput}
											label={recipeName ? recipeName : 'Recipe name'}
											value={newRecipeName}
											error={lookForError && !newRecipeName ? true : false}
											mode='outlined'
											onChangeText={setNewRecipeName}
											onSubmitEditing={() => {
												handleSetRecipeName(newRecipeName);
											}}
										/>
										<IconButton
											icon='check-outline'
											size={20}
											onPress={() => {
												handleSetRecipeName(newRecipeName);
											}}
										/>
									</View>
								</>
							)}
							{(editImage || recipeImage.length === 0) && (
								<>
									<Title>Image: </Title>
									<View style={styleSheet.recipeInputContainer}>
										<TextInput
											style={styleSheet.recipeInput}
											label={recipeImage ? recipeImage : 'image-url'}
											value={newRecipeImage}
											error={lookForError && !newRecipeImage ? true : false}
											mode='outlined'
											onChangeText={setNewRecipeImage}
											onSubmitEditing={() => {
												handleSetRecipeImage(newRecipeImage);
											}}
										/>
										<IconButton
											icon='check-outline'
											size={20}
											onPress={() => {
												handleSetRecipeImage(newRecipeImage);
											}}
										/>
									</View>
								</>
							)}

							<NewRecipeDesc
								recipeDesc={recipeDesc}
								setRecipeDesc={setRecipeDesc}
								lookForError={lookForError}
							/>

							<NewRecipeIngredients
								recipeIngredients={recipeIngredients}
								setRecipeIngredients={setRecipeIngredients}
							/>

							<NewRecipeSteps
								recipeSteps={recipeSteps}
								setRecipeSteps={setRecipeSteps}
							/>

							<NewPortions
								recipePortions={recipePortions}
								setRecipePortions={setRecipePortions}
								lookForError={lookForError}
							/>
						</Card.Content>
					</Card>
				</KeyboardAvoidingView>
			</ScrollView>
		</Provider>
	);
};

export default NewRecipeScreen;
