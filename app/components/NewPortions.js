import { useState, useEffect, useContext } from 'react';
import { View, Alert } from 'react-native';
import { Title, IconButton, TextInput, Paragraph } from 'react-native-paper';
import { styleSheet } from '../styleSheets/StyleSheet';

const NewPortions = ({ recipePortions, setRecipePortions, lookForError }) => {
	const [editPortions, setEditPortions] = useState(false);
	const [portionsEdit, setPortionsEdit] = useState('');

	const patch = (portions) => {
		if (portions) {
			setRecipePortions(portions);
			setEditPortions(false);
			setPortionsEdit('');
		} else {
			console.log('patch failed');
		}
	};

	if (!recipePortions || editPortions) {
		return (
			<>
				<Title style={styleSheet.recipeTitle}>Portions:</Title>

				<View style={styleSheet.recipeInputContainer}>
					<TextInput
						style={styleSheet.recipeStepDesc}
						label={recipePortions ? recipePortions : 'Portions'}
						value={portionsEdit}
						error={lookForError && !portionsEdit ? true : false}
						mode='outlined'
						keyboardType='numeric'
						onChangeText={(text) => setPortionsEdit(text.replace(/[^0-9]/, ''))}
						onSubmitEditing={() => {
							patch(portionsEdit);
						}}
					/>
					<IconButton
						icon='check-outline'
						size={20}
						onPress={() => {
							patch(portionsEdit);
						}}
					/>
				</View>
			</>
		);
	} else if (recipePortions) {
		return (
			<>
				<Title style={styleSheet.recipeTitle}>Portions:</Title>
				<View style={styleSheet.recipeInputContainer}>
					<Paragraph>{recipePortions}</Paragraph>
					<View style={styleSheet.pencilContainer}>
						<IconButton
							icon='pencil'
							size={15}
							onPress={() => {
								setEditPortions(true);
							}}
						/>
					</View>
				</View>
			</>
		);
	} else {
		return <></>;
	}
};

export default NewPortions;
