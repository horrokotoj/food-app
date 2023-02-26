import { useState, useContext, useEffect, useCallback, useRef } from 'react';
import {
	ScrollView,
	RefreshControl,
	KeyboardAvoidingView,
	View,
	Alert,
	TouchableOpacity,
	Keyboard,
} from 'react-native';
import {
	Appbar,
	Provider,
	Title,
	Paragraph,
	TextInput,
	IconButton,
	List,
	Portal,
	Modal,
	Menu,
	Divider,
	Chip,
	Button,
} from 'react-native-paper';
import { styleSheet } from '../styleSheets/StyleSheet';

import { NetworkContext } from '../context/NetworkContext';
import { AccessTokenContext } from '../context/AccessTokenContext';
import { UsernameContext } from '../context/UsernameContext';

const ListScreen = ({ route, navigation }) => {
	const [refreshing, setRefreshing] = useState(false);
	const [listContent, setListContent] = useState(null);
	const [undoQueue, setUndoQueue] = useState([]);
	const [newQuantity, setNewQuantity] = useState(null);
	const [edit, setEdit] = useState(null);
	const [newQuantityAvailable, setNewQuantityAvailable] = useState(null);
	const [menuVisible, setMenuVisible] = useState(false);
	const [addItem, setAddItem] = useState(false);
	const [allIngredients, setAllIngredients] = useState(null);
	const [ingredients, setIngredients] = useState(null);
	const [ingToAdd, setIngToAdd] = useState('');
	const [quantToAdd, setQuantToAdd] = useState(null);
	const [measurements, setMeasurements] = useState(null);
	const [measurement, setMeasurement] = useState(null);
	const [addStoreSection, setAddStoreSection] = useState(null);
	const [storeSections, setStoreSections] = useState(null);
	const [storeSection, setStoreSection] = useState(null);
	const [searchData, setSearchData] = useState(null);
	const [match, setMatch] = useState(false);
	const [addingNew, setAddingNew] = useState(false);

	const { list, Return } = route.params;

	const accessToken = useContext(AccessTokenContext);
	const { request } = useContext(NetworkContext);

	const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

	const amountRef = useRef();

	const handleGetListContent = async () => {
		let response;
		try {
			response = await request(
				accessToken,
				null,
				`listcontent/${list.ShoppingListId}`,
				'GET'
			);
			if (response.length > 0) {
				let sortedList = response.sort((a, b) => {
					return a.Indexx - b.Indexx;
				});
				setListContent(sortedList);
			} else {
				setListContent(null);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const getIngredients = async () => {
		let response;
		try {
			response = await request(accessToken, null, `ingredients`, 'GET');
			if (response.length > 0) {
				let sortedList = response.sort((a, b) => {
					return a.IngredientName - b.IngredientName;
				});
				setAllIngredients(sortedList);
			} else {
				setAllIngredients(null);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const getMeasurements = async () => {
		let response;
		try {
			response = await request(accessToken, null, `measurements`, 'GET');
			if (response.length > 0) {
				let sortedList = response.sort((a, b) => {
					return a.MeasurementName - b.MeasurementName;
				});
				setMeasurements(sortedList);
			} else {
				setListContent(null);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const getStoreSections = async () => {
		let response;
		try {
			response = await request(accessToken, null, `storesections`, 'GET');
			if (response.length > 0) {
				let sortedList = response.sort((a, b) => {
					return a.StoreSectionName - b.StoreSectionName;
				});
				setStoreSections(sortedList);
			} else {
				setListContent(null);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const add = async (ingToAdd, quantToAdd, measurement, ingredientId) => {
		if (ingredients && ingToAdd && quantToAdd) {
			if (!ingredientId) {
				for (let i = 0; i < ingredients.length; i++) {
					if (ingToAdd === ingredients[i].IngredientName) {
						ingredientId = ingredients[i].IngredientId;
						break;
					}
				}
			}
			if (ingredientId) {
				let bodyObj = {
					ShoppingListId: list.ShoppingListId,
					IngredientId: ingredientId,
					Quantity: quantToAdd,
					MeasurementName: measurement.MeasurementName,
					StoreId: list.StoreId,
				};
				console.log(bodyObj);
				if (await request(accessToken, bodyObj, 'listcontent', 'POST')) {
					handleGetListContent();
					setAddItem(false);
					setMeasurement(null);
					setIngToAdd('');
					setQuantToAdd('');
				}
			} else {
				alert('Failed to add');
			}
		}
	};

	const addNew = async (
		ingToAdd,
		quantToAdd,
		measurement,
		localStoreSectionId
	) => {
		if (ingToAdd && quantToAdd && measurement.MeasurementId) {
			let bodyObj = {
				IngredientName: ingToAdd,
				MeasurementId: measurement.MeasurementId,
				StoreSectionId: localStoreSectionId,
			};
			let response = await request(accessToken, bodyObj, 'ingredient', 'post');
			if (response.insertId) {
				add(ingToAdd, quantToAdd, measurement, response.insertId);
			} else {
				console.log('failed to add new');
				alert('Failed to add new ingredient, check if it already exists.');
			}
		}
	};

	const confirmDelete = (ShoppingListId, IngredientId) => {
		return Alert.alert('Item will be removed', '', [
			// The "Yes" button
			{
				text: 'Yes',
				onPress: async () => {
					let bodyObj = {
						ShoppingListId: ShoppingListId,
						IngredientId: IngredientId,
					};
					if (await request(accessToken, bodyObj, 'listcontent', 'DELETE')) {
						let thisListContent = [];
						for (let i = 0; i < listContent.length; i++) {
							if (IngredientId != listContent[i].IngredientId) {
								thisListContent = thisListContent.concat(listContent[i]);
							}
						}
						setListContent(thisListContent);
						setEdit(false);
						setNewQuantity(null);
						setNewQuantityAvailable(null);
					}
				},
			},
			// The "No" button
			// Does nothing but dismiss the dialog when tapped
			{
				text: 'No',
				onPress: () => {},
			},
		]);
	};

	const patchQuantityAvailable = async (
		ShoppingListId,
		IngredientId,
		newQuantityAvailable
	) => {
		let obj = {
			IngredientId: IngredientId,
			ShoppingListId: ShoppingListId,
			QuantityAvailable: newQuantityAvailable,
		};
		try {
			if (await request(accessToken, obj, `listcontent`, 'PATCH')) {
				let thisListContent = [];
				for (let i = 0; i < listContent.length; i++) {
					if (listContent[i].IngredientId === IngredientId) {
						thisListContent = thisListContent.concat({
							...listContent[i],
							QuantityAvailable: newQuantityAvailable,
						});
					} else {
						thisListContent = thisListContent.concat(listContent[i]);
					}
				}
				setListContent(thisListContent);
				setEdit(false);
				setNewQuantity(null);
				setNewQuantityAvailable(null);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const patchQuantity = async (ShoppingListId, IngredientId, newQuantity) => {
		let obj = {
			IngredientId: IngredientId,
			ShoppingListId: ShoppingListId,
			Quantity: newQuantity,
		};
		try {
			if (await request(accessToken, obj, `listcontent`, 'PATCH')) {
				let thisListContent = [];
				for (let i = 0; i < listContent.length; i++) {
					if (listContent[i].IngredientId === IngredientId) {
						thisListContent = thisListContent.concat({
							...listContent[i],
							Quantity: newQuantity,
						});
					} else {
						thisListContent = thisListContent.concat(listContent[i]);
					}
				}
				setListContent(thisListContent);
				setEdit(false);
				setNewQuantity(null);
				setNewQuantityAvailable(null);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handlePick = async (IngredientId, ShoppingListId) => {
		let newUndoQueue = undoQueue;
		newUndoQueue.push({
			IngredientId: IngredientId,
			ShoppingListId: ShoppingListId,
			Picked: 0,
		});
		let obj = {
			IngredientId: IngredientId,
			ShoppingListId: ShoppingListId,
			Picked: 1,
		};
		try {
			if (await request(accessToken, obj, `listcontent`, 'PATCH')) {
				setUndoQueue(newUndoQueue);

				let thisListContent = [];
				for (let i = 0; i < listContent.length; i++) {
					if (listContent[i].IngredientId === IngredientId) {
						thisListContent = thisListContent.concat({
							...listContent[i],
							Picked: 1,
						});
					} else {
						thisListContent = thisListContent.concat(listContent[i]);
					}
				}
				setListContent(thisListContent);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleUnPick = async (IngredientId, ShoppingListId) => {
		let newUndoQueue = undoQueue;
		console.log('newUndoQueue');
		console.log(newUndoQueue);
		newUndoQueue.push({
			IngredientId: IngredientId,
			ShoppingListId: ShoppingListId,
			Picked: 1,
		});
		console.log(newUndoQueue);

		let obj = {
			IngredientId: IngredientId,
			ShoppingListId: ShoppingListId,
			Picked: 0,
		};
		try {
			if (await request(accessToken, obj, `listcontent`, 'PATCH')) {
				setUndoQueue(newUndoQueue);

				let thisListContent = [];
				for (let i = 0; i < listContent.length; i++) {
					if (listContent[i].IngredientId === IngredientId) {
						thisListContent = thisListContent.concat({
							...listContent[i],
							Picked: 0,
						});
					} else {
						thisListContent = thisListContent.concat(listContent[i]);
					}
				}
				setListContent(thisListContent);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleUndo = async () => {
		if (undoQueue.length > 0) {
			let newUndoQueue = undoQueue;
			let undo = newUndoQueue.pop();
			console.log(newUndoQueue);
			let obj = {
				IngredientId: undo.IngredientId,
				ShoppingListId: undo.ShoppingListId,
				Picked: undo.Picked,
			};
			let thisList = listContent;
			console.log('sortedList');
			console.log(thisList);
			try {
				if (await request(accessToken, obj, `listcontent`, 'PATCH')) {
					setUndoQueue(newUndoQueue);

					let thisListContent = [];
					for (let i = 0; i < thisList.length; i++) {
						if (thisList[i].IngredientId === undo.IngredientId) {
							thisListContent = thisListContent.concat({
								...thisList[i],
								Picked: undo.Picked,
							});
						} else {
							thisListContent = thisListContent.concat(thisList[i]);
						}
					}
					setListContent(thisListContent);
				}
			} catch (err) {
				console.log(err);
			}
		}
	};

	const handleNewIngredient = async () => {
		setAddingNew(true);
		if (!measurements) {
			await getMeasurements();
		}
		if (!storeSections) {
			await getStoreSections();
		}
	};

	const handleOpenModal = () => {
		setMenuVisible(false);
		setAddItem(true);
		getIngredients();
	};

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		const getListContent = async () => {
			await handleGetListContent();
		};

		getListContent();
		setRefreshing(false);
	}, []);

	useEffect(() => {
		handleGetListContent();
	}, []);

	useEffect(() => {
		if (listContent && allIngredients) {
			let unusedIngredients = [];
			for (let i = 0; i < allIngredients.length; i++) {
				for (let j = 0; j < listContent.length; j++) {
					if (
						listContent[j].IngredientName === allIngredients[i].IngredientName
					) {
						break;
					} else if (j == listContent.length - 1) {
						unusedIngredients = unusedIngredients.concat(allIngredients[i]);
					}
				}
			}
			setIngredients(unusedIngredients);
		} else {
			setIngredients(allIngredients);
		}
	}, [allIngredients]);

	useEffect(() => {
		if (ingToAdd == '') {
			setSearchData(null);
		} else if (ingredients) {
			let match = false;
			let measurement = null;
			const updatedData = ingredients.filter((ing) => {
				if (ingToAdd.toUpperCase() === ing.IngredientName.toUpperCase()) {
					match = true;
					measurement = { MeasurementName: ing.Measurement };
				}
				const item_data = `${ing.IngredientName.toUpperCase().slice(0, -1)}`;
				const text_data = ingToAdd.toUpperCase();
				return item_data.indexOf(text_data) > -1;
			});
			setMatch(match);
			console.log(measurement);
			setMeasurement(measurement);
			setSearchData(updatedData);
		}
	}, [ingToAdd]);

	console.log('undoQueue');
	console.log(undoQueue);
	console.log('listContent');

	console.log(list);

	return (
		<Provider>
			<Appbar.Header style={styleSheet.appbarHeader}>
				<Appbar.BackAction
					onPress={() => {
						navigation.navigate(Return);
					}}
				/>
				<Appbar.Content title={list.ShoppingListName} />
				<Menu
					visible={menuVisible}
					onDismiss={() => {
						setMenuVisible(false);
					}}
					anchor={
						<Appbar.Action
							icon={menuVisible ? 'check-outline' : MORE_ICON}
							color='white'
							onPress={() => {
								setMenuVisible(!menuVisible);
							}}
						/>
					}
					statusBarHeight={200}
				>
					{undoQueue.length > 0 ? (
						<Menu.Item
							icon='undo'
							onPress={() => {
								handleUndo(undoQueue);
							}}
							title='Undo'
						/>
					) : (
						<Menu.Item icon='undo' title='Undo' disabled />
					)}

					<Divider />
					<Menu.Item icon='share' onPress={() => {}} title='Share' />
				</Menu>
			</Appbar.Header>
			<Portal>
				<Modal
					visible={addItem}
					onDismiss={() => {
						setAddItem(false);
						// setAddStoreSection(false);
						// setMeasurement(null);
						// setQuantToAdd(null);
					}}
					style={styleSheet.modalStyle}
					contentContainerStyle={styleSheet.modalContainerStyle}
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
								measurements &&
								measurements.map((measurement) => {
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
								!storeSection &&
								storeSections &&
								storeSections.map((storeSection) => {
									return (
										<Chip
											key={storeSection.StoreSectionId}
											style={styleSheet.ingredientChip}
											onPress={() => {
												setStoreSection({
													StoreSectionId: storeSection.StoreSectionId,
													StoreSectionName: storeSection.StoreSectionName,
												});
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
									setStoreSection(null);
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
									//addNew(ingToAdd, quantToAdd, measurement);
									setAddStoreSection(!addStoreSection);
									Keyboard.dismiss();
								}}
							/>
						)}
					</View>
					{addStoreSection && <Title>Store section:</Title>}
					{addStoreSection && storeSection && storeSection.StoreSectionName && (
						<Paragraph>{storeSection.StoreSectionName}</Paragraph>
					)}
					{((match && measurement) ||
						(storeSection && storeSection.StoreSectionName)) && (
						<IconButton
							icon='check-outline'
							style={{ alignSelf: 'center' }}
							size={20}
							onPress={() => {
								if (match) {
									add(ingToAdd, quantToAdd, measurement);
								} else {
									addNew(
										ingToAdd,
										quantToAdd,
										measurement,
										storeSection.StoreSectionId
									);
								}
							}}
						/>
					)}
				</Modal>
			</Portal>
			<View style={styleSheet.container}>
				<ScrollView
					keyboardShouldPersistTaps={'handled'}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					}
				>
					{listContent &&
						listContent.map((content) => {
							let subtitle;
							let neededQuant;
							if (content.QuantityAvailable != null) {
								neededQuant = content.Quantity - content.QuantityAvailable;
								subtitle = `Available: ${content.QuantityAvailable} Needed: ${content.Quantity}`;
							} else {
								neededQuant = content.Quantity;

								subtitle = `Needed: ${content.Quantity}`;
							}
							if (content.Picked === 0) {
								return (
									<View key={content.IngredientId}>
										<List.Item
											title={`${content.IngredientName}:`}
											description={subtitle}
											onPress={() => {
												if (edit) {
													setEdit(null);
												} else {
													handlePick(
														content.IngredientId,
														content.ShoppingListId,
														listContent
													);
												}
											}}
											onLongPress={() => {
												if (edit) {
													setEdit(null);
												} else {
													setEdit(content);
												}
											}}
											right={() => (
												<Paragraph
													style={{ width: '30%', alignSelf: 'center' }}
												>{`${neededQuant} ${content.MeasurementName}`}</Paragraph>
											)}
										/>
										{edit === content.IngredientId && <></>}
									</View>
								);
							}
						})}
					{listContent &&
						listContent.map((content) => {
							let subtitle;
							let neededQuant;
							if (content.QuantityAvailable != null) {
								neededQuant = content.Quantity - content.QuantityAvailable;
								subtitle = `Available: ${content.QuantityAvailable} Needed: ${content.Quantity}`;
							} else {
								neededQuant = content.Quantity;

								subtitle = `Needed: ${content.Quantity}`;
							}
							if (content.Picked === 1) {
								return (
									<List.Item
										key={content.IngredientId}
										titleStyle={{
											color: 'gray',
											textDecorationLine: 'line-through',
										}}
										title={`${content.IngredientName}:`}
										onPress={() =>
											handleUnPick(content.IngredientId, content.ShoppingListId)
										}
										right={() => (
											<Paragraph
												style={{ width: '30%', alignSelf: 'center' }}
											>{`${neededQuant} ${content.MeasurementName}`}</Paragraph>
										)}
									/>
								);
							}
						})}
				</ScrollView>
				<Button
					icon='plus-circle-outline'
					labelStyle={styleSheet.addRecipeButtonLabelStyle}
					style={styleSheet.addRecipeButton}
					onPress={() => {
						handleOpenModal();
					}}
				/>
			</View>
			<Portal>
				<Modal
					visible={edit}
					onDismiss={() => {
						setEdit(false);
						setNewQuantity(null);
						setNewQuantityAvailable(null);
					}}
					style={styleSheet.modalStyle}
					contentContainerStyle={styleSheet.modalContainerStyle}
				>
					{edit && (
						<>
							<View style={styleSheet.listEditView}>
								<TextInput
									style={styleSheet.recipeInput}
									label={
										'Available quantity' +
										': ' +
										edit.QuantityAvailable +
										' ' +
										edit.MeasurementName
									}
									value={newQuantityAvailable}
									mode='outlined'
									keyboardType='numeric'
									onChangeText={setNewQuantityAvailable}
									onSubmitEditing={() => {
										patchQuantityAvailable(
											edit.ShoppingListId,
											edit.IngredientId,
											newQuantityAvailable
										);
									}}
								/>
								<IconButton
									icon='check-outline'
									size={20}
									onPress={() => {
										patchQuantityAvailable(
											edit.ShoppingListId,
											edit.IngredientId,
											newQuantityAvailable
										);
									}}
								/>
							</View>
							<View style={styleSheet.listEditView}>
								<TextInput
									style={styleSheet.recipeInput}
									label={
										'Quantity' +
										': ' +
										edit.Quantity +
										' ' +
										edit.MeasurementName
									}
									value={newQuantity}
									mode='outlined'
									keyboardType='numeric'
									onChangeText={setNewQuantity}
									onSubmitEditing={() => {
										patchQuantity(
											edit.ShoppingListId,
											edit.IngredientId,
											newQuantity
										);
									}}
								/>
								<IconButton
									icon='check-outline'
									size={20}
									onPress={() => {
										patchQuantity(
											edit.ShoppingListId,
											edit.IngredientId,
											newQuantity
										);
									}}
								/>
							</View>
							<View style={styleSheet.listEditView}>
								<IconButton
									icon='delete-outline'
									size={20}
									onPress={() => {
										confirmDelete(edit.ShoppingListId, edit.IngredientId);
									}}
								/>
							</View>
						</>
					)}
				</Modal>
			</Portal>
		</Provider>
	);
};

export default ListScreen;
