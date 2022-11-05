import { useState, useEffect, useContext } from 'react';
import { View, Alert } from 'react-native';
import { Title, IconButton, TextInput, Paragraph } from 'react-native-paper';
import { styleSheet } from '../styleSheets/StyleSheet';

import { AccessTokenContext } from '../context/AccessTokenContext';
import { NetworkContext } from '../context/NetworkContext';

const Portions = ({ isEditing, recipeId, RecipePortions }) => {
	const [portions, setPortions] = useState(null);
	const [editPortions, setEditPortions] = useState(false);
	const [portionsEdit, setPortionsEdit] = useState(false);

	const accessToken = useContext(AccessTokenContext);
	const { request } = useContext(NetworkContext);

	const patch = async (recipePortions) => {
		if (recipePortions) {
			let bodyObj = {
				RecipeId: recipeId,
				RecipePortions: recipePortions,
			};
			let response = await request(accessToken, bodyObj, 'recipe', 'PATCH');
			if (response) {
				console.log('After patch');
				setPortions(recipePortions);
				setEditPortions(false);
				setPortionsEdit('');
			} else {
				console.log('patch failed');
				console.log(response);
			}
		} else {
			console.log('patch failed');
		}
	};

	useEffect(() => {
		if (RecipePortions) {
			setPortions(RecipePortions);
		}
	}, [RecipePortions]);

	useEffect(() => {
		setPortionsEdit('');
		setEditPortions(false);
	}, [isEditing]);

	if (isEditing && editPortions) {
		return (
			<>
				<Title style={styleSheet.recipeTitle}>Portions:</Title>

				<View style={styleSheet.recipeInputContainer}>
					<TextInput
						style={styleSheet.recipeStepDesc}
						label={portions}
						value={portionsEdit}
						mode='outlined'
						keyboardType='numeric'
						onChangeText={setPortionsEdit}
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
	} else if (portions) {
		return (
			<>
				<Title style={styleSheet.recipeTitle}>Portions:</Title>
				<Paragraph></Paragraph>
				<View style={styleSheet.recipeInputContainer}>
					<Paragraph>{portions}</Paragraph>
					{isEditing && (
						<View style={styleSheet.pencilContainer}>
							<IconButton
								icon='pencil'
								size={15}
								onPress={() => {
									setEditPortions(true);
								}}
							/>
						</View>
					)}
				</View>
			</>
		);
	} else {
		return <></>;
	}
};

export default Portions;
