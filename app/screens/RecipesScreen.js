import { useState, useContext } from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { NetworkContext } from '../context/NetworkContext';
import { AccessTokenContext } from '../context/AccessTokenContext';
import { styleSheet } from '../styleSheets/StyleSheet';

const RecipesScreen = () => {
  const [recipes, setRecipes] = useState('');
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

  console.log('Recipes in RecipesScreen');
  console.log(recipes);

  return (
    <View style={styleSheet.container}>
      <Text>RecipesScreen</Text>
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
    </View>
  );
};

export default RecipesScreen;
