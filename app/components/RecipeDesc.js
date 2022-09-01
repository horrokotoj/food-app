import { useState, useEffect, useContext } from 'react';
import { View, Alert } from 'react-native';
import { Paragraph, TextInput, IconButton, Title } from 'react-native-paper';

import { styleSheet } from '../styleSheets/StyleSheet';

import { AccessTokenContext } from '../context/AccessTokenContext';
import { NetworkContext } from '../context/NetworkContext';

const RecipeDesc = ({ recipeDesc, isEditing, recipeId }) => {
  const [desc, setDesc] = useState('');
  const [edit, setEdit] = useState(false);
  const [editDesc, setEditDesc] = useState('');

  const accessToken = useContext(AccessTokenContext);
  const { patchRecipe, deleteRecipe } = useContext(NetworkContext);

  const patch = async () => {
    let bodyObj = {
      RecipeId: recipeId,
      RecipeDesc: editDesc,
    };
    if (await patchRecipe(accessToken, bodyObj)) {
      let tmpDesc = editDesc;
      setDesc(tmpDesc);
      setEdit(false);
    }
  };

  const confirmDelete = () => {
    return Alert.alert('Description will be removed', '', [
      // The "Yes" button
      {
        text: 'Yes',
        onPress: async () => {
          let bodyObj = {
            RecipeId: recipeId,
            value: 'RecipeDesc',
          };
          if (await deleteRecipe(accessToken, bodyObj)) {
            setDesc('');
            setEditDesc('');
            setEdit(false);
          }
        },
      },
      // The "No" button
      // Does nothing but dismiss the dialog when tapped
      {
        text: 'No',
        onPress: () => {
          alert('no');
        },
      },
    ]);
  };

  useEffect(() => {
    if (recipeDesc) setDesc(recipeDesc);
  }, []);

  useEffect(() => {
    setEditDesc(desc);
    setEdit(false);
  }, [isEditing]);

  if (isEditing && edit) {
    return (
      <>
        <Title>Description: </Title>
        <View style={styleSheet.recipeInputContainer}>
          <TextInput
            style={styleSheet.recipeInput}
            value={editDesc}
            mode='outlined'
            multiline={true}
            onChangeText={setEditDesc}
          />
          <IconButton
            icon='check-outline'
            size={20}
            onPress={() => {
              patch();
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
              setEdit(false);
            }}
          />
        </View>
      </>
    );
  } else if (desc) {
    return (
      <>
        <Title>Description: </Title>
        <View style={styleSheet.recipeInputContainer}>
          <Paragraph>{desc}</Paragraph>
          {isEditing && (
            <View style={styleSheet.pencilContainer}>
              <IconButton
                icon='pencil'
                size={15}
                onPress={() => {
                  setEdit(true);
                }}
              />
            </View>
          )}
        </View>
      </>
    );
  } else if (isEditing && !desc) {
    return (
      <>
        <Title>Description: </Title>
        <View style={styleSheet.recipeInputContainer}>
          <TextInput
            style={styleSheet.recipeInput}
            value={editDesc}
            mode='outlined'
            multiline={true}
            onChangeText={setEditDesc}
          />
          <IconButton
            icon='check-outline'
            size={20}
            onPress={() => {
              patch();
            }}
          />
        </View>
      </>
    );
  } else {
    return <></>;
  }
};
export default RecipeDesc;
