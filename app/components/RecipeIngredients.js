import { useState, useEffect, useContext } from 'react';
import { View } from 'react-native';
import { Title, List, TextInput, IconButton } from 'react-native-paper';
import { styleSheet } from '../styleSheets/StyleSheet';

import { AccessTokenContext } from '../context/AccessTokenContext';
import { NetworkContext } from '../context/NetworkContext';

const RecipeIngredients = ({ recipeIngredients, isEditing, recipeId }) => {
  const [ings, setIngs] = useState('');
  const [ingToEdit, setIngToEdit] = useState('');
  const [editIng, setEditIng] = useState('');

  const accessToken = useContext(AccessTokenContext);
  const { patchRecipeIngredient } = useContext(NetworkContext);

  const patch = async (ingredientId) => {
    let bodyObj = {
      RecipeId: recipeId,
      IngredientId: ingredientId,
      Quantity: editIng,
    };
    if (await patchRecipeIngredient(accessToken, bodyObj)) {
      console.log('After patch');
      let tmpEditIng = editIng;
      let tmpIngs = ings.map((ing) =>
        ing.IngredientId === ingredientId
          ? { ...ing, Quantity: tmpEditIng }
          : ing
      );
      setIngs(tmpIngs);
      setIngToEdit('');
      setEditIng('');
    }
  };

  useEffect(() => {
    if (recipeIngredients) setIngs(recipeIngredients);
  }, [recipeIngredients]);

  useEffect(() => {
    setIngToEdit('');
  }, [isEditing]);

  console.log('RecipeIngredients');
  console.log(ings);

  if (ings && !isEditing) {
    return (
      <>
        <Title>Ingredients: </Title>
        {ings.map((ing) => {
          return (
            <List.Item
              key={ing.IngredientName}
              title={ing.IngredientName}
              description={ing.Quantity + ' ' + ing.MeasurementName}
            />
          );
        })}
      </>
    );
  } else if (isEditing) {
    return (
      <>
        <Title>Ingredients: </Title>
        {ings.map((ing) => {
          if (ingToEdit === ing.IngredientName) {
            return (
              <View
                key={ing.IngredientName}
                style={styleSheet.recipeInputContainer}
              >
                <TextInput
                  style={styleSheet.recipeInput}
                  label={
                    ing.IngredientName +
                    ': ' +
                    ing.Quantity +
                    ' ' +
                    ing.MeasurementName
                  }
                  value={editIng}
                  mode='outlined'
                  onChangeText={setEditIng}
                  onSubmitEditing={() => {
                    patch(ing.IngredientId);
                  }}
                />
                <IconButton
                  icon='check-outline'
                  size={20}
                  onPress={() => {
                    patch(ing.IngredientId);
                  }}
                />
                <IconButton
                  icon='delete-outline'
                  size={20}
                  onPress={() => {
                    confirmDelete();
                  }}
                />
                <IconButton
                  icon='pencil-off'
                  size={20}
                  onPress={() => {
                    setEditIng('');
                    setIngToEdit('');
                  }}
                />
              </View>
            );
          } else {
            return (
              <List.Item
                key={ing.IngredientName}
                title={ing.IngredientName}
                description={ing.Quantity + ' ' + ing.MeasurementName}
                right={() => (
                  <IconButton
                    icon='pencil'
                    size={15}
                    onPress={() => {
                      setIngToEdit(ing.IngredientName);
                    }}
                  />
                )}
              />
            );
          }
        })}
      </>
    );
  } else {
    return <></>;
  }
};

export default RecipeIngredients;
