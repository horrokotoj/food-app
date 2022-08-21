import { Image } from 'react-native';
import { Avatar, Card, IconButton } from 'react-native-paper';
import { styleSheet } from '../styleSheets/StyleSheet';

const Recipe = ({ recipe }) => {
	console.log('In Recipe');
	console.log(recipe);
	return (
		<Card.Title
			title={recipe.RecipeName}
			subtitle={recipe.RecipeDesc}
			left={(props) => (
				<Image
					style={styleSheet.recipeImage}
					source={{ uri: recipe.RecipeImage }}
				/>
			)}
		/>
	);
};

export default Recipe;
