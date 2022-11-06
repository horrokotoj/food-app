import { useState, useContext, useCallback, useEffect } from 'react';
import {
	View,
	ScrollView,
	RefreshControl,
	TouchableOpacity,
} from 'react-native';
import { Button } from 'react-native-paper';
import { NetworkContext } from '../context/NetworkContext';
import { AccessTokenContext } from '../context/AccessTokenContext';
import { styleSheet } from '../styleSheets/StyleSheet';
import Recipe from '../components/Recipe';

const RecipesScreen = ({ navigation }) => {
	const [recipes, setRecipes] = useState('');
	const [refreshing, setRefreshing] = useState(false);
	const accessToken = useContext(AccessTokenContext);
	const { getRecipes } = useContext(NetworkContext);

	const handleGetRecipes = async () => {
		let response;
		try {
			response = await getRecipes(accessToken);
			if (response) {
				setRecipes(response);
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

	console.log('Recipes in RecipesScreen');

	return (
		<>
			<View style={styleSheet.container}>
				{recipes ? (
					<ScrollView
						refreshControl={
							<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
						}
					>
						{recipes ? (
							recipes.map((recipe) => {
								let recipeId = recipe.RecipeId;
								return (
									<View key={recipeId}>
										<TouchableOpacity
											onPress={() => {
												navigation.navigate('Recipe', {
													Recipe: recipe,
												});
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
				<Button
					icon='plus-circle-outline'
					labelStyle={styleSheet.addRecipeButtonLabelStyle}
					style={styleSheet.addRecipeButton}
					onPress={() => {
						navigation.navigate('New recipe');
					}}
				/>
			</View>
		</>
	);
};

export default RecipesScreen;
