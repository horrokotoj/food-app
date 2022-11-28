import { useState, useContext, useEffect, useCallback } from 'react';
import {
	ScrollView,
	RefreshControl,
	KeyboardAvoidingView,
	View,
	Alert,
} from 'react-native';
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

import RecipeDesc from '../components/RecipeDesc';
import RecipeIngredients from '../components/RecipeIngredients';
import RecipeSteps from '../components/RecipeSteps';
import Portions from '../components/Portions';

const RecipeScreen = ({ route, navigation }) => {
	const [recipe, setRecipe] = useState(null);
	const [refreshing, setRefreshing] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [recipeIngredients, setRecipeIngredients] = useState(null);
	const [recipeSteps, setRecipeSteps] = useState(null);
	const [editImage, setEditImage] = useState(false);
	const [imageEdit, setImageEdit] = useState('');
	const [editName, setEditName] = useState(false);
	const [nameEdit, setNameEdit] = useState('');

	const [addIngredient, setAddIngredient] = useState(false);

	const { Recipe } = route.params;

	const accessToken = useContext(AccessTokenContext);
	const username = useContext(UsernameContext);
	const { request } = useContext(NetworkContext);

	const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		const getRecipeIngredientsOnRender = async () => {
			await handleGetRecipeIngredients();
		};

		const getRecipeStepsOnRender = async () => {
			await handleGetRecipeSteps();
		};

		getRecipeIngredientsOnRender();
		getRecipeStepsOnRender();
		setRefreshing(false);
	}, []);

	const patch = async (recipeName, recipeImage) => {
		let bodyObj = {
			RecipeId: recipe.RecipeId,
		};
		if (recipeName) {
			bodyObj = { ...bodyObj, RecipeName: recipeName };
		}
		if (recipeImage) {
			bodyObj = { ...bodyObj, RecipeImage: recipeImage };
		}
		if (await request(accessToken, bodyObj, 'recipe', 'PATCH')) {
			let tmpRecipe = recipe;
			if (recipeName) {
				tmpRecipe = { ...tmpRecipe, RecipeName: recipeName };
			}
			if (recipeImage) {
				tmpRecipe = { ...tmpRecipe, RecipeImage: recipeImage };
			}
			setRecipe(tmpRecipe);
			setEditImage(false);
			setEditName(false);
		}
	};

	const confirmDelete = () => {
		return Alert.alert('Recipe will be removed permanently', '', [
			// The "Yes" button
			{
				text: 'Yes',
				onPress: async () => {
					let bodyObj = {
						RecipeId: recipe.RecipeId,
					};

					if (await request(accessToken, bodyObj, 'recipe', 'DELETE')) {
						console.log('After delete');
						navigation.navigate('Recipes');
					}
				},
			},
			// The "No" button
			// Does nothing but dismiss the dialog when tapped
			{
				text: 'No',
				onPress: () => {},
			},
		]);
	};

	const handleGetRecipeIngredients = async () => {
		let response;
		try {
			response = await request(
				accessToken,
				null,
				`recipeingredient/${Recipe.RecipeId}`,
				'GET'
			);
			if (response.length > 0) {
				setRecipeIngredients(response);
			} else {
				setRecipeIngredients(null);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleGetRecipeSteps = async () => {
		let response;
		try {
			response = await request(
				accessToken,
				null,
				`recipesteps/${Recipe.RecipeId}`,
				'GET'
			);
			if (response.length > 0) {
				console.log('Response in handleGetRecipeSteps');
				console.log(response);
				setRecipeSteps(response);
			} else {
				setRecipeSteps(null);
			}
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		console.log('Effect recipe');
		const getRecipeIngredientsOnRender = async () => {
			await handleGetRecipeIngredients();
		};

		const getRecipeStepsOnRender = async () => {
			await handleGetRecipeSteps();
		};
		setRecipe(Recipe);
		getRecipeIngredientsOnRender();
		getRecipeStepsOnRender();
	}, [Recipe]);

	console.log(recipe);

	if (recipe) {
		return (
			<Provider>
				<Appbar.Header style={{}}>
					<Appbar.BackAction
						onPress={() => {
							setIsEditing(false);
							navigation.navigate('Recipes');
						}}
					/>
					<Appbar.Content
						title={recipe.RecipeName}
						onPress={() => {
							if (isEditing) setEditName(!editName);
						}}
					/>
					{username === recipe.RecipeOwner && isEditing && (
						<Appbar.Action
							icon={editImage ? 'close-outline' : 'image-edit-outline'}
							color='white'
							onPress={() => {
								setEditImage(!editImage);
							}}
						/>
					)}
					{username === recipe.RecipeOwner && (
						<Appbar.Action
							icon={isEditing ? 'check-outline' : MORE_ICON}
							color='white'
							onPress={() => {
								setIsEditing(!isEditing);
							}}
						/>
					)}
				</Appbar.Header>
				<ScrollView
					keyboardShouldPersistTaps={'handled'}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					}
				>
					<KeyboardAvoidingView
						behavior={Platform.OS === 'ios' ? 'padding' : null}
					>
						<Card>
							<Card.Cover source={{ uri: recipe.RecipeImage }} />
							<Card.Content>
								{editName && (
									<>
										<Title>Name: </Title>
										<View style={styleSheet.recipeInputContainer}>
											<TextInput
												style={styleSheet.recipeInput}
												label={
													recipe.RecipeName ? recipe.RecipeName : 'Recipe name'
												}
												value={nameEdit}
												mode='outlined'
												onChangeText={setNameEdit}
												onSubmitEditing={() => {
													patch(nameEdit, null);
												}}
											/>
											<IconButton
												icon='check-outline'
												size={20}
												onPress={() => {
													patch(nameEdit, null);
												}}
											/>
										</View>
									</>
								)}
								{editImage && (
									<>
										<Title>Image: </Title>
										<View style={styleSheet.recipeInputContainer}>
											<TextInput
												style={styleSheet.recipeInput}
												label={
													recipe.RecipeImage ? recipe.RecipeImage : 'image-url'
												}
												value={imageEdit}
												mode='outlined'
												onChangeText={setImageEdit}
												onSubmitEditing={() => {
													patch(null, imageEdit);
												}}
											/>
											<IconButton
												icon='check-outline'
												size={20}
												onPress={() => {
													patch(null, imageEdit);
												}}
											/>
										</View>
									</>
								)}
								<RecipeDesc
									recipeDesc={recipe.RecipeDesc}
									isEditing={isEditing}
									recipeId={recipe.RecipeId}
								/>
								<RecipeIngredients
									recipeIngredients={recipeIngredients}
									isEditing={isEditing}
									recipeId={recipe.RecipeId}
								/>
								<RecipeSteps
									isEditing={isEditing}
									recipeId={recipe.RecipeId}
									recipeSteps={recipeSteps}
								/>
								<Portions
									isEditing={isEditing}
									recipeId={recipe.RecipeId}
									RecipePortions={recipe.RecipePortions}
								/>
								{isEditing && (
									<Button
										icon='delete-circle-outline'
										labelStyle={styleSheet.deleteButtonLabelStyle}
										style={styleSheet.deleteButton}
										onPress={async () => {
											confirmDelete();
										}}
									/>
								)}
							</Card.Content>
						</Card>
					</KeyboardAvoidingView>
				</ScrollView>
			</Provider>
		);
	} else {
		return <></>;
	}
};

export default RecipeScreen;
