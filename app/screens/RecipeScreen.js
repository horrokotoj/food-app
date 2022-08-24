import { useState, useContext, useEffect } from 'react';
import { ScrollView } from 'react-native';
import {
  Appbar,
  Menu,
  Button,
  Divider,
  Provider,
  Card,
  Avatar,
  Title,
  Paragraph,
  List,
} from 'react-native-paper';
import { set } from 'react-native-reanimated';
import { styleSheet } from '../styleSheets/StyleSheet';

import { NetworkContext } from '../context/NetworkContext';
import { AccessTokenContext } from '../context/AccessTokenContext';

import RecipeIngredient from '../components/RecipeIngredient';
import RecipeStep from '../components/RecipeStep';

const RecipeScreen = ({ route, navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [recipeIngredients, setRecipeIngredients] = useState(null);
  const [recipeSteps, setRecipeSteps] = useState(null);
  const { recipe } = route.params;

  const accessToken = useContext(AccessTokenContext);
  const { getRecipeIngredients, getRecipeSteps } = useContext(NetworkContext);

  const openMenu = () => setMenuVisible(true);

  const closeMenu = () => setMenuVisible(false);

  const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

  const handleGetRecipeIngredients = async () => {
    let response;
    try {
      response = await getRecipeIngredients(accessToken, recipe.RecipeId);
      if (response.length > 0) {
        setRecipeIngredients(response);
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
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
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
            navigation.navigate('Recipes');
          }}
        />
        <Appbar.Content title={recipe.RecipeName} />

        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action
              icon={MORE_ICON}
              color='white'
              onPress={() => {
                setMenuVisible(!menuVisible);
              }}
            />
          }
        >
          <Menu.Item onPress={() => {}} title='Edit' />
          <Menu.Item onPress={() => {}} title='Delete' />
        </Menu>
      </Appbar.Header>

      <ScrollView>
        <Card>
          <Card.Cover source={{ uri: recipe.RecipeImage }} />
          <Card.Content>
            <Title>Description</Title>
            <Paragraph>{recipe.RecipeDesc}</Paragraph>
            {recipeSteps && <Title>Steps</Title>}

            {recipeSteps ? (
              recipeSteps.map((recipeStep) => {
                return <RecipeStep key={recipeStep.Step} step={recipeStep} />;
              })
            ) : (
              <></>
            )}
            {recipeIngredients && <Title>Ingredients</Title>}
            {recipeIngredients ? (
              recipeIngredients.map((recipeIngredient) => {
                return (
                  <RecipeIngredient
                    key={recipeIngredient.IngredientName}
                    ingredient={recipeIngredient}
                  />
                );
              })
            ) : (
              <></>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </Provider>
  );
};

export default RecipeScreen;
