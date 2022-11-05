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

import NewRecipeDesc from '../components/NewRecipeDesc';
import RecipeIngredients from '../components/RecipeIngredients';
import RecipeSteps from '../components/RecipeSteps';
import Portions from '../components/Portions';

const NewRecipeScreen = ({ route, navigation }) => {
	const [recipeName, setRecipeName] = useState('');
	const [recipeImage, setRecipeImage] = useState(null);
	const [recipeDesc, setRecipeDesc] = useState(null);
	const [recipeIngredients, setRecipeIngredients] = useState(null);
	const [recipeSteps, setRecipeSteps] = useState(null);
	const [recipePortions, setRecipePortions] = useState(null);

	const accessToken = useContext(AccessTokenContext);
	const username = useContext(UsernameContext);
	const { getRecipeIngredients, getRecipeSteps } = useContext(NetworkContext);

	const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

	console.log('NewRecipeScreen');

	return (
		<Provider>
			<Appbar.Header>
				<Appbar.BackAction
					onPress={() => {
						navigation.navigate('Recipes');
					}}
				/>
				{recipeName ? (
					<Appbar.Content title={recipeName} />
				) : (
					<Appbar.Content title='New recipe' />
				)}
			</Appbar.Header>
			<ScrollView keyboardShouldPersistTaps={'handled'}>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : null}
				>
					<Card>
						{recipeImage && <Card.Cover source={{ uri: recipeImage }} />}
						<Card.Content>
							<NewRecipeDesc
								recipeDesc={recipeDesc}
								setRecipeDesc={setRecipeDesc}
							/>
							{/*
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
							/>*/}
						</Card.Content>
					</Card>
				</KeyboardAvoidingView>
			</ScrollView>
		</Provider>
	);
};

export default NewRecipeScreen;
