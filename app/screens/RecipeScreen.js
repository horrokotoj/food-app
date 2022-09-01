import { useState, useContext, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import {
  Appbar,
  Menu,
  Provider,
  Card,
  Title,
  Paragraph,
  TextInput,
  Button,
} from 'react-native-paper';
import { styleSheet } from '../styleSheets/StyleSheet';

import { NetworkContext } from '../context/NetworkContext';
import { AccessTokenContext } from '../context/AccessTokenContext';
import { UsernameContext } from '../context/UsernameContext';

import RecipeDesc from '../components/RecipeDesc';
import RecipeIngredients from '../components/RecipeIngredients';
import RecipeStep from '../components/RecipeStep';

const RecipeScreen = ({ route, navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [recipeIngredients, setRecipeIngredients] = useState(null);
  const [recipeSteps, setRecipeSteps] = useState(null);

  const { recipe } = route.params;

  const accessToken = useContext(AccessTokenContext);
  const username = useContext(UsernameContext);
  const { getRecipeIngredients, getRecipeSteps } = useContext(NetworkContext);

  const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

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

      <ScrollView>
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

            {(recipeIngredients || isEditing) && (
              <Title style={styleSheet.recipeTitle}>Ingredients:</Title>
            )}
            {/*recipeIngredients &&
              !isEditing &&
              recipeIngredients.map((recipeIngredient) => {
                return (
                  <RecipeIngredient
                    key={recipeIngredient.IngredientName}
                    ingredient={recipeIngredient}
                  />
                );
              })*/}

            {isEditing && (
              <Button
                icon='plus-circle-outline'
                labelStyle={styleSheet.addButtonLabelStyle}
                style={styleSheet.addButton}
                onPress={() => {}}
              />
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </Provider>
  );
};

export default RecipeScreen;
