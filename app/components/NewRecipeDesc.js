import { useState, useEffect, useContext } from 'react';
import { View, Alert } from 'react-native';
import { Paragraph, TextInput, IconButton, Title } from 'react-native-paper';

import { styleSheet } from '../styleSheets/StyleSheet';

const NewRecipeDesc = ({ recipeDesc, setRecipeDesc, lookForError }) => {
	const [edit, setEdit] = useState(false);
	const [editDesc, setEditDesc] = useState('');

	const handleSetRecipeDesc = (editDesc) => {
		setEdit(false);
		setRecipeDesc(editDesc);
		setEditDesc('');
	};

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
						label={recipeDesc ? recipeDesc : 'Description'}
						value={editDesc}
						mode='outlined'
						error={lookForError && !editDesc ? true : false}
						multiline={true}
						onChangeText={setEditDesc}
						onSubmit={() => {
							handleSetRecipeDesc(editDesc);
						}}
					/>
					<IconButton
						icon='check-outline'
						size={20}
						onPress={() => {
							handleSetRecipeDesc(editDesc);
						}}
					/>
				</View>
			</>
		);
	}
};
export default NewRecipeDesc;
