import { useState, useEffect, useContext, useRef } from 'react';
import { View, Alert, ScrollView, Keyboard } from 'react-native';
import {
	Title,
	List,
	TextInput,
	IconButton,
	Button,
	Chip,
	Portal,
	Modal,
	Paragraph,
} from 'react-native-paper';
import { styleSheet } from '../styleSheets/StyleSheet';

import { AccessTokenContext } from '../context/AccessTokenContext';
import { NetworkContext } from '../context/NetworkContext';

const NewRecipeIngredients = ({ recipeIngredients, setRecipeIngredients }) => {
	const [ingToEdit, setIngToEdit] = useState('');
	const [editIng, setEditIng] = useState('');
	const [addIngredient, setAddIngredient] = useState(false);
	const [ingToAdd, setIngToAdd] = useState('');
	const [quantToAdd, setQuantToAdd] = useState('');
	const [allIngredients, setAllIngredients] = useState(null);
	const [newIngredients, setNewIngredients] = useState(null);
	const [searchData, setSearchData] = useState(null);
	const [match, setMatch] = useState(false);
	const [measurement, setMeasurement] = useState(null);
	const [addingNew, setAddingNew] = useState(false);
	const [allMeasurements, setAllMeasurements] = useState(null);
	const [storeSections, setStoreSections] = useState(null);
	const [storeSectionId, setStoreSectionId] = useState(null);
	const [storeSectionName, setStoreSectionName] = useState(null);
	const [addStoreSection, setAddStoreSection] = useState(false);

	const accessToken = useContext(AccessTokenContext);
	const { request } = useContext(NetworkContext);

	const amountRef = useRef();

	const add = (ingToAdd, quantToAdd, measurement, ingredientId) => {
		if (newIngredients && ingToAdd && quantToAdd) {
			if (!ingredientId) {
				ingredientId = getIngredientId(ingToAdd, newIngredients);
			}

			if (ingredientId) {
				let tmpIngs = recipeIngredients.concat({
					IngredientId: ingredientId,
					IngredientName: ingToAdd,
					MeasurementName: measurement.MeasurementName,
					Quantity: quantToAdd,
				});
				setRecipeIngredients(tmpIngs);
				setAddIngredient(false);
				setMeasurement(null);
				setIngToAdd('');
				setQuantToAdd('');
				setAddStoreSection(false);
				setStoreSectionId(null);
				setStoreSectionName(null);
			} else {
				alert('Failed to add');
			}
		}
	};

	const addNew = async (ingToAdd, quantToAdd, measurement, storeSectionId) => {
		if (ingToAdd && quantToAdd && measurement.MeasurementId) {
			let bodyObj = {
				IngredientName: ingToAdd,
				StoreSectionId: storeSectionId,
				MeasurementId: measurement.MeasurementId,
			};
			let response = await request(accessToken, bodyObj, 'ingredient', 'POST');
			if (response.insertId) {
				setAddingNew(false);
				add(ingToAdd, quantToAdd, measurement, response.insertId);
			} else {
				console.log('failed to add new');
			}
		}
	};

	const confirmDelete = (ingredientName) => {
		return Alert.alert('Description will be removed', '', [
			// The "Yes" button
			{
				text: 'Yes',
				onPress: async () => {
					const ingredientId = getIngredientId(
						ingredientName,
						recipeIngredients
					);
					console.log(ingredientId);

					let tmpIngs = [];
					for (let i = 0; i < recipeIngredients.length; i++) {
						if (ingredientId != recipeIngredients[i].IngredientId) {
							tmpIngs = tmpIngs.concat(recipeIngredients[i]);
						}
					}
					setRecipeIngredients(tmpIngs);
					setIngToEdit('');
					setEditIng('');
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

	const handleGetMeasurements = async () => {
		let response;
		try {
			response = await request(accessToken, null, 'measurements', 'GET');
			if (response.length > 0) {
				setAllMeasurements(response);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleGetStoreSections = async () => {
		let response;
		try {
			response = await request(accessToken, null, 'storesections', 'GET');
			if (response.length > 0) {
				setStoreSections(response);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleGetIngredients = async () => {
		let response;
		try {
			response = await request(accessToken, null, 'ingredients', 'GET');
			if (response.length > 0) {
				setAllIngredients(response);
				return true;
			}
			return false;
		} catch (err) {
			console.log(err);
			return false;
		}
	};

	const handleNewIngredient = async () => {
		setAddingNew(true);
		if (!allMeasurements) {
			await handleGetMeasurements();
		}
		if (!storeSections) {
			await handleGetStoreSections();
		}
	};

	const getIngredientId = (ingredientName, dataSet) => {
		if (ingredientName && dataSet) {
			for (let i = 0; i < dataSet.length; i++) {
				if (ingredientName === dataSet[i].IngredientName) {
					return dataSet[i].IngredientId;
				}
			}
		}
	};

	useEffect(() => {
		if (recipeIngredients && allIngredients) {
			if (recipeIngredients.length > 0) {
				let unusedIngredients = [];
				for (let i = 0; i < allIngredients.length; i++) {
					for (let j = 0; j < recipeIngredients.length; j++) {
						if (
							recipeIngredients[j].IngredientName ===
							allIngredients[i].IngredientName
						) {
							break;
						} else if (j == recipeIngredients.length - 1) {
							unusedIngredients = unusedIngredients.concat(allIngredients[i]);
						}
					}
				}
				setNewIngredients(unusedIngredients);
			} else {
				setNewIngredients(allIngredients);
			}
		}
	}, [allIngredients]);

	useEffect(() => {
		if (ingToAdd == '') {
			setSearchData(null);
		} else if (newIngredients) {
			let match = false;
			let measurement = null;
			const updatedData = newIngredients.filter((ing) => {
				console.log(ing);
				if (ingToAdd.toUpperCase() === ing.IngredientName.toUpperCase()) {
					match = true;
					measurement = { MeasurementName: ing.Measurement };
				}
				const item_data = `${ing.IngredientName.toUpperCase().slice(0, -1)}`;
				const text_data = ingToAdd.toUpperCase();
				return item_data.indexOf(text_data) > -1;
			});
			setMatch(match);
			setMeasurement(measurement);
			setSearchData(updatedData);
		}
	}, [ingToAdd]);

	console.log('RecipeIngredients');

	return (
		<>
			<Title>Ingredients: </Title>
			{recipeIngredients &&
				recipeIngredients.map((ing) => {
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
									keyboardType='numeric'
									onChangeText={setEditIng}
									onSubmitEditing={() => {
										alert(ing.IngredientId);
									}}
								/>
								<IconButton
									icon='check-outline'
									size={20}
									onPress={() => {
										alert(ing.IngredientId);
									}}
								/>
								<IconButton
									icon='delete-outline'
									size={20}
									onPress={() => {
										confirmDelete(ingToEdit);
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
			{!addIngredient && (
				<Button
					icon='plus-circle-outline'
					labelStyle={styleSheet.addButtonLabelStyle}
					style={styleSheet.addButton}
					onPress={async () => {
						setAddIngredient(true);
						await handleGetIngredients();
					}}
				/>
			)}
			{addIngredient && (
				<Portal>
					<Modal
						visible={addIngredient}
						onDismiss={() => {
							setAddIngredient(false);
							setAddStoreSection(false);
							setMeasurement(null);
							setQuantToAdd(null);
						}}
						style={{ marginBottom: '40%' }}
						contentContainerStyle={{
							backgroundColor: 'white',
							padding: 25,
							marginLeft: '10%',
							marginRight: '10%',
						}}
					>
						<ScrollView>
							<View style={styleSheet.ingredientsContainer}>
								{searchData &&
									!addingNew &&
									searchData.map((ing) => {
										return (
											<Chip
												key={ing.IngredientId}
												style={styleSheet.ingredientChip}
												onPress={() => {
													setIngToAdd(ing.IngredientName);
												}}
											>
												{ing.IngredientName}
											</Chip>
										);
									})}
								{addingNew &&
									!measurement &&
									allMeasurements &&
									allMeasurements.map((measurement) => {
										return (
											<Chip
												key={measurement.MeasurementId}
												style={styleSheet.ingredientChip}
												onPress={() => {
													setMeasurement(measurement);
												}}
											>
												{measurement.MeasurementName}
											</Chip>
										);
									})}
								{addStoreSection &&
									!storeSectionId &&
									storeSections.map((storeSection) => {
										return (
											<Chip
												key={storeSection.StoreSectionId}
												style={styleSheet.ingredientChip}
												onPress={() => {
													setStoreSectionId(storeSection.StoreSectionId);
													setStoreSectionName(storeSection.StoreSectionName);
												}}
											>
												{storeSection.StoreSectionName}
											</Chip>
										);
									})}
							</View>
						</ScrollView>

						<View style={styleSheet.recipeInputContainer}>
							<TextInput
								style={styleSheet.recipeAdd}
								value={ingToAdd}
								mode='outlined'
								label='Ingredient'
								multiline={true}
								onChangeText={setIngToAdd}
							/>

							{!match && !addingNew && (
								<IconButton
									icon='plus-circle-outline'
									size={20}
									onPress={() => {
										handleNewIngredient();
										Keyboard.dismiss();
									}}
								/>
							)}
							{!match && addingNew && (
								<IconButton
									icon='close-circle-outline'
									size={20}
									onPress={() => {
										setAddingNew(false);
										setMeasurement(null);
										setQuantToAdd(null);
										setAddStoreSection(false);
										setStoreSectionId(null);
										setStoreSectionName(null);
									}}
								/>
							)}
						</View>
						<View style={styleSheet.recipeInputContainer}>
							{measurement && (
								<TextInput
									style={styleSheet.recipeQuant}
									value={quantToAdd}
									mode='outlined'
									keyboardType='numeric'
									label={measurement.MeasurementName}
									ref={amountRef}
									onChangeText={setQuantToAdd}
									onSubmitEditing={() => {
										if (match) {
											add(ingToAdd, quantToAdd, measurement);
										} else {
											addNew(ingToAdd, quantToAdd, measurement);
										}
									}}
								/>
							)}

							{!match && measurement && (
								<IconButton
									icon='arrow-down-right'
									size={20}
									onPress={() => {
										setAddStoreSection(!addStoreSection);
										Keyboard.dismiss();
									}}
								/>
							)}
						</View>
						{addStoreSection && <Title>Store section:</Title>}
						{addStoreSection && storeSectionName && (
							<Paragraph>{storeSectionName}</Paragraph>
						)}
						{((match && measurement) || storeSectionName) && (
							<IconButton
								icon='check-outline'
								style={{ alignSelf: 'center' }}
								size={20}
								onPress={() => {
									if (match) {
										add(ingToAdd, quantToAdd, measurement);
									} else {
										addNew(ingToAdd, quantToAdd, measurement, storeSectionId);
									}
								}}
							/>
						)}
					</Modal>
				</Portal>
			)}
		</>
	);
};

export default NewRecipeIngredients;
