import { useState, useEffect, useContext } from 'react';
import { View, Alert } from 'react-native';
import { Paragraph, TextInput, IconButton, Title } from 'react-native-paper';

import { styleSheet } from '../styleSheets/StyleSheet';

const NewRecipeDesc = ({ recipeDesc, setRecipeDesc }) => {
	const [desc, setDesc] = useState('');
	const [edit, setEdit] = useState(false);
	const [editDesc, setEditDesc] = useState('');

	console.log('NewRecipeDesc');
	if (recipeDesc && !edit) {
		return (
			<>
				<Title>Description: </Title>
				<View style={styleSheet.recipeInputContainer}>
					<Paragraph>{recipeDesc}</Paragraph>
					<View style={styleSheet.pencilContainer}>
						<IconButton
							icon='pencil'
							size={15}
							onPress={() => {
								setEdit(true);
							}}
						/>
					</View>
				</View>
			</>
		);
	} else if (!recipeDesc || edit) {
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
						onSubmit={() => {
							setEdit(false);
							setRecipeDesc(editDesc);
						}}
					/>
					<IconButton
						icon='check-outline'
						size={20}
						onPress={() => {
							setEdit(false);
							setRecipeDesc(editDesc);
						}}
					/>
				</View>
			</>
		);
	}
};
export default NewRecipeDesc;
