import { useState, useContext, useEffect, useCallback } from 'react';
import { ScrollView, RefreshControl, KeyboardAvoidingView } from 'react-native';
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
} from 'react-native-paper';
import { styleSheet } from '../styleSheets/StyleSheet';

import { NetworkContext } from '../context/NetworkContext';
import { AccessTokenContext } from '../context/AccessTokenContext';
import { UsernameContext } from '../context/UsernameContext';

import RecipeDesc from '../components/RecipeDesc';
import RecipeIngredients from '../components/RecipeIngredients';
import RecipeStep from '../components/RecipeStep';

const RecipeScreen = ({ route, navigation }) => {
	const [refreshing, setRefreshing] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [recipeIngredients, setRecipeIngredients] = useState(null);
	const [recipeSteps, setRecipeSteps] = useState(null);

	const [addIngredient, setAddIngredient] = useState(false);

	const { recipe } = route.params;

	const accessToken = useContext(AccessTokenContext);
	const username = useContext(UsernameContext);
	const { getRecipeIngredients, getRecipeSteps } = useContext(NetworkContext);

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

	const handleGetRecipeIngredients = async () => {
		let response;
		try {
			response = await getRecipeIngredients(accessToken, recipe.RecipeId);
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
			response = await getRecipeSteps(accessToken, recipe.RecipeId);
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

		getRecipeIngredientsOnRender();
		getRecipeStepsOnRender();
	}, [recipe]);

	console.log(recipe);

	return (
		<Provider>
			<Appbar.Header>
				<Appbar.BackAction
					onPress={() => {
						setIsEditing(false);
						navigation.navigate('Recipes');
					}}
				/>
				<Appbar.Content title={recipe.RecipeName} />

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

							{(recipeSteps || isEditing) && (
								<Title style={styleSheet.recipeTitle}>Steps:</Title>
							)}
							{recipeSteps &&
								!isEditing &&
								recipeSteps.map((recipeStep) => {
									return <RecipeStep key={recipeStep.Step} step={recipeStep} />;
								})}

							{isEditing && (
								<Button
									icon='plus-circle-outline'
									labelStyle={styleSheet.addButtonLabelStyle}
									style={styleSheet.addButton}
									onPress={() => {}}
								/>
							)}
							{(recipe.RecipePortions || isEditing) && (
								<Title style={styleSheet.recipeTitle}>Portions:</Title>
							)}
							{recipe.RecipePortions && !isEditing && (
								<Paragraph>{recipe.RecipePortions}</Paragraph>
							)}
						</Card.Content>
					</Card>
				</KeyboardAvoidingView>
			</ScrollView>
		</Provider>
	);
};

export default RecipeScreen;
