import { useState, useContext, useCallback, useEffect } from 'react';
import {
	View,
	ScrollView,
	RefreshControl,
	TouchableOpacity,
	List,
} from 'react-native';
import { Button } from 'react-native-paper';
import { NetworkContext } from '../context/NetworkContext';
import { AccessTokenContext } from '../context/AccessTokenContext';
import { styleSheet } from '../styleSheets/StyleSheet';
import Recipe from './Recipe';

const Recipes = ({ navigation, Return, initialDate }) => {
	const [recipes, setRecipes] = useState(null);
	const [refreshing, setRefreshing] = useState(false);
	const accessToken = useContext(AccessTokenContext);
	const { request } = useContext(NetworkContext);

	const handleGetRecipes = async () => {
		let response;
		try {
			response = await request(accessToken, null, 'recipes', 'GET');
			if (response) {
				setRecipes(response);
			} else {
				setRecipes(null);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleAddMeal = async (initialDate, recipeId, portions) => {
		let obj = {
			RecipeDate: initialDate,
			RecipeId: recipeId,
			Portions: portions,
		};
		console.log(obj);
		let response;
		try {
			response = await request(accessToken, obj, 'recipecalendar', 'POST');
			if (response) {
				console.log(response);
				console.log('recipecalendar successfull');
				return true;
			} else {
				return false;
			}
		} catch (err) {
			console.log(err);
		}
	};

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await handleGetRecipes();
		setRefreshing(false);
	}, []);

	useEffect(() => {
		const getRecipesOnRender = async () => {
			await handleGetRecipes();
		};
		getRecipesOnRender();
	}, []);

	return (
		<>
			{recipes ? (
				<ScrollView
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					}
				>
					{recipes ? (
						recipes.map((recipe) => {
							let recipeId = recipe.RecipeId;
							console.log(recipe);
							return (
								<View key={recipeId}>
									<TouchableOpacity
										onPress={() => {
											if (Return == 'Recipes') {
												navigation.navigate('Recipe', {
													Recipe: recipe,
													Return: Return,
												});
											} else {
												if (
													handleAddMeal(
														initialDate,
														recipe.RecipeId,
														recipe.RecipePortions
													)
												) {
													navigation.navigate('Calendar');
												} else {
													alert('Failed to add meal!');
												}
											}
										}}
									>
										<Recipe recipe={recipe}></Recipe>
									</TouchableOpacity>
								</View>
							);
						})
					) : (
						<></>
					)}
				</ScrollView>
			) : (
				<Button
					mode='contained'
					labelStyle={styleSheet.buttonLabelStyle}
					style={styleSheet.button}
					onPress={() => {
						handleGetRecipes();
					}}
				>
					Get recipes
				</Button>
			)}
		</>
	);
};

export default Recipes;
