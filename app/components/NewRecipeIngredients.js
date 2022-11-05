import { useState, useEffect, useContext, useRef } from 'react';
import { View, Alert } from 'react-native';
import {
	Title,
	List,
	TextInput,
	IconButton,
	Button,
	Chip,
	Portal,
	Modal,
} from 'react-native-paper';
import { styleSheet } from '../styleSheets/StyleSheet';

import { AccessTokenContext } from '../context/AccessTokenContext';
import { NetworkContext } from '../context/NetworkContext';

const NewRecipeIngredients = ({ recipeIngredients, setRecipeIngredients }) => {
	const [ings, setIngs] = useState('');
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

	const accessToken = useContext(AccessTokenContext);
	const {
		patchRecipeIngredient,
		deleteRecipeIngredient,
		getIngredients,
		postRecipeIngredient,
		getMeasurements,
		postIngredient,
	} = useContext(NetworkContext);

	const addNew = async (ingToAdd, quantToAdd, measurement) => {
		console.log('In addNew');
		if (ingToAdd && quantToAdd && measurement.MeasurementId) {
			let bodyObj = {
				IngredientName: ingToAdd,
				MeasurementId: measurement.MeasurementId,
			};
			let response = await postIngredient(accessToken, bodyObj);
			if (response.insertId) {
				add(ingToAdd, quantToAdd, measurement, response.insertId);
			} else {
				console.log('failed to add new');
			}
		}
	};

	const handleGetMeasurements = async () => {
		let response;
		try {
			response = await getMeasurements(accessToken);
			if (response.length > 0) {
				console.log('Response in handleGetMeasurements');
				console.log(response);
				setAllMeasurements(response);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleGetIngredients = async () => {
		let response;
		try {
			response = await getIngredients(accessToken);
			if (response.length > 0) {
				console.log('Response in handleGetRecipeSteps');
				console.log(response);
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
	};

	const getIngredientId = (ingredientName, dataSet) => {
		let id;
		if (ingredientName && dataSet) {
			for (let i = 0; i < dataSet.length; i++) {
				if (ingredientName === dataSet[i].IngredientName) {
					return dataSet[i].IngredientId;
				}
			}
		}
	};

	useEffect(() => {
		if (recipeIngredients) setIngs(recipeIngredients);
	}, [recipeIngredients]);

	useEffect(() => {
		setIngToEdit('');
	}, [isEditing]);

	useEffect(() => {
		if (ings && allIngredients) {
			let unusedIngredients = [];
			for (let i = 0; i < allIngredients.length; i++) {
				for (let j = 0; j < ings.length; j++) {
					if (ings[j].IngredientName === allIngredients[i].IngredientName) {
						break;
					} else if (j == ings.length - 1) {
						unusedIngredients = unusedIngredients.concat(allIngredients[i]);
					}
				}
			}
			setNewIngredients(unusedIngredients);
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
									keyboardType='numeric'
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
				{isEditing && !addIngredient && (
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
				{isEditing && addIngredient && (
					<Portal>
						<Modal
							visible={addIngredient}
							onDismiss={() => {
								setAddIngredient(false);
							}}
							style={{ marginBottom: '40%' }}
							contentContainerStyle={{
								backgroundColor: 'white',
								padding: 20,
								marginLeft: '10%',
								marginRight: '10%',
							}}
						>
							<View style={styleSheet.ingredientsContainer}>
								{searchData &&
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
							</View>
							<View style={styleSheet.recipeInputContainer}>
								<TextInput
									style={styleSheet.recipeAdd}
									value={ingToAdd}
									mode='outlined'
									label='Ingredient'
									multiline={true}
									onChangeText={setIngToAdd}
									onSubmit={() => {
										amountRef.current.focus();
									}}
								/>

								{!match && !addingNew && (
									<IconButton
										icon='plus-circle-outline'
										size={20}
										onPress={() => {
											handleNewIngredient();
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
										}}
									/>
								)}

								{/*<IconButton
									icon='pencil-off'
									size={20}
									onPress={() => {
										setIngToAdd('');
										setQuantToAdd('');
										setAddIngredient(false);
									}}
								/>*/}
							</View>
							<View style={styleSheet.recipeInputContainer}>
								{addingNew && !measurement && (
									<View style={styleSheet.ingredientsContainer}>
										{allMeasurements &&
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
									</View>
								)}
								{measurement && (
									<TextInput
										style={styleSheet.recipeQuant}
										value={quantToAdd}
										mode='outlined'
										keyboardType='numeric'
										label={measurement.MeasurementName}
										ref={amountRef}
										onChangeText={setQuantToAdd}
										onSubmit={() => {
											add(ingToAdd, quantToAdd, measurement);
										}}
									/>
								)}
								{match && measurement && (
									<IconButton
										icon='check-outline'
										size={20}
										onPress={() => {
											add(ingToAdd, quantToAdd, measurement);
										}}
									/>
								)}
								{!match && measurement && (
									<IconButton
										icon='check'
										size={20}
										onPress={() => {
											addNew(ingToAdd, quantToAdd, measurement);
										}}
									/>
								)}
							</View>
						</Modal>
					</Portal>
				)}
			</>
		);
	} else {
		return <></>;
	}
};

export default NewRecipeIngredients;
