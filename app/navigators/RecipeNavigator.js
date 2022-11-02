import { createStackNavigator } from '@react-navigation/stack';
import RecipesScreen from '../screens/RecipesScreen';
import RecipeScreen from '../screens/RecipeScreen';

// A stack navigator for authentication pages
const RecipeStack = createStackNavigator();

const RecipeNavigator = () => {
	return (
		<RecipeStack.Navigator>
			<RecipeStack.Screen name='Recipes' component={RecipesScreen} />
			<RecipeStack.Screen name='Recipe' component={RecipeScreen} />
		</RecipeStack.Navigator>
	);
};

export default RecipeNavigator;
