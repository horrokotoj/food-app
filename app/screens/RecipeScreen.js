import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { styleSheet } from '../styleSheets/StyleSheet';

const RecipeScreen = ({ route, navigation }) => {
  const { recipe } = route.params;
  console.log(recipe);
  return (
    <View style={styleSheet.container}>
      <Text>RecipeScreen </Text>
      <Button
        mode='contained'
        labelStyle={styleSheet.buttonLabelStyle}
        style={styleSheet.button}
        onPress={() => {
          console.log('GoBack');
          navigation.navigate('Recipes');
        }}
      >
        Back
      </Button>
      <Text>{recipe.RecipeName} </Text>
    </View>
  );
};

export default RecipeScreen;
