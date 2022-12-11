import { useState, useContext, useEffect, useCallback } from 'react';
import {
	ScrollView,
	RefreshControl,
	KeyboardAvoidingView,
	View,
	Alert,
	TouchableOpacity,
} from 'react-native';
import {
	Appbar,
	Provider,
	Card,
	Title,
	Paragraph,
	TextInput,
	Button,
	IconButton,
	List,
	Portal,
	Modal,
} from 'react-native-paper';
import { styleSheet } from '../styleSheets/StyleSheet';

import { ShakeEventExpo } from '../components/ShakeEventExpo';

import { NetworkContext } from '../context/NetworkContext';
import { AccessTokenContext } from '../context/AccessTokenContext';
import { UsernameContext } from '../context/UsernameContext';

import RecipeDesc from '../components/RecipeDesc';
import RecipeIngredients from '../components/RecipeIngredients';
import RecipeSteps from '../components/RecipeSteps';
import Portions from '../components/Portions';

const ListScreen = ({ route, navigation }) => {
	const [refreshing, setRefreshing] = useState(false);
	const [listContent, setListContent] = useState(null);
	const [undoQueue, setUndoQueue] = useState([]);
	const [undoing, setUndoing] = useState(false);
	const [editQuantity, setEditQuantity] = useState(null);
	const [newQuantity, setNewQuantity] = useState(null);
	const [edit, setEdit] = useState(null);
	const [newQuantityAvailable, setNewQuantityAvailable] = useState(null);
	const [editShoppingList, setEditShoppingList] = useState(false);

	const { list, Return } = route.params;

	const accessToken = useContext(AccessTokenContext);
	const username = useContext(UsernameContext);
	const { request } = useContext(NetworkContext);

	const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

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

	const handleUndo = async (undoQueue) => {
		if (undoing && undoQueue.length > 0) {
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
					return Alert.alert('Undo', '', [
						// The "Yes" button
						{
							text: 'Yes',
							onPress: async () => {
								let newUndoQueue = undoQueue;
								let undo = newUndoQueue.pop();
								console.log(newUndoQueue);
								let obj = {
									IngredientId: undo.IngredientId,
									ShoppingListId: undo.ShoppingListId,
									Picked: undo.Picked,
								};
								console.log('sortedList');
								console.log(sortedList);

								try {
									if (await request(accessToken, obj, `listcontent`, 'PATCH')) {
										setUndoQueue(newUndoQueue);

										let thisListContent = [];
										console.log(sortedList);
										for (let i = 0; i < sortedList.length; i++) {
											if (sortedList[i].IngredientId === undo.IngredientId) {
												thisListContent = thisListContent.concat({
													...sortedList[i],
													Picked: undo.Picked,
												});
											} else {
												thisListContent = thisListContent.concat(sortedList[i]);
											}
										}
										setListContent(thisListContent);
									}
								} catch (err) {
									console.log(err);
								}
								setUndoing(false);
							},
						},
						// The "No" button
						// Does nothing but dismiss the dialog when tapped
						{
							text: 'No',
							onPress: () => {
								setUndoing(false);
							},
						},
					]);
				} else {
					setListContent(null);
				}
			} catch (err) {
				console.log(err);
			}
		}
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
		handleUndo(undoQueue);
	}, [undoing]);

	useEffect(() => {
		ShakeEventExpo.addListener(() => {
			//add your code here
			console.log('shake shake shake');
			setUndoing(true);
		});

		return () => {
			// Your code here...
			console.log('Killing shaker');
			ShakeEventExpo.removeListener();
		};
	}, []);

	console.log('undoQueue');
	console.log(undoQueue);
	console.log('listContent');

	if (listContent) console.log(listContent.length);

	return (
		<Provider>
			<Appbar.Header style={styleSheet.appbarHeader}>
				<Appbar.BackAction
					onPress={() => {
						navigation.navigate(Return);
					}}
				/>
				<Appbar.Content title={list.ShoppingListName} />
				{/* <Appbar.Action
					icon={editShoppingList ? 'check-outline' : MORE_ICON}
					color='white'
					onPress={() => {
						setEditShoppingList(!editShoppingList);
					}}
				/> */}
			</Appbar.Header>
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
										onLongPress={() => alert('long press')}
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
