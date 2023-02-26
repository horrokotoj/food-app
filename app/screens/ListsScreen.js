import { useState, useContext, useCallback, useEffect } from 'react';
import {
	View,
	ScrollView,
	RefreshControl,
	TouchableOpacity,
	Alert,
} from 'react-native';
import {
	Title,
	Card,
	Button,
	Provider,
	Portal,
	Modal,
	TextInput,
	IconButton,
} from 'react-native-paper';
import { NetworkContext } from '../context/NetworkContext';
import { AccessTokenContext } from '../context/AccessTokenContext';
import { styleSheet } from '../styleSheets/StyleSheet';

const ListsSceen = ({ navigation }) => {
	const [lists, setLists] = useState(null);
	const [refreshing, setRefreshing] = useState(false);
	const [edit, setEdit] = useState(null);
	const [newListName, setNewListName] = useState(null);
	const [newList, setNewList] = useState(false);
	const accessToken = useContext(AccessTokenContext);
	const { request } = useContext(NetworkContext);

	const addNewList = async (newListName) => {
		let obj = {
			ShoppingListName: newListName,
		};
		try {
			let response = await request(accessToken, obj, `shoppinglist`, 'POST');
			if (response.insertId) {
				thisLists = lists.concat({
					ShoppingListName: newListName,
				});
				setLists(thisLists);
				setEdit(null);
				setNewList(false);
				setNewListName(null);
			} else {
				console.log('failed to add new');
				alert('Failed to add new ingredient, check if it already exists.');
			}
		} catch (err) {
			console.log(err);
		}
	};

	const patchListName = async (ShoppingListId, newListName) => {
		let obj = {
			ShoppingListId: ShoppingListId,
			ShoppingListName: newListName,
		};
		try {
			if (await request(accessToken, obj, `shoppinglist`, 'PATCH')) {
				let thisLists = [];
				for (let i = 0; i < lists.length; i++) {
					if (lists[i].ShoppingListId === ShoppingListId) {
						thisLists = thisLists.concat({
							...lists[i],
							ShoppingListName: newListName,
						});
					} else {
						thisLists = thisLists.concat(lists[i]);
					}
				}
				setLists(thisLists);
				setEdit(null);
				setNewListName(null);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const confirmDelete = (ShoppingListId) => {
		return Alert.alert('Item will be removed', '', [
			// The "Yes" button
			{
				text: 'Yes',
				onPress: async () => {
					let bodyObj = {
						ShoppingListId: ShoppingListId,
					};
					if (await request(accessToken, bodyObj, 'shoppinglist', 'DELETE')) {
						let thisLists = [];
						for (let i = 0; i < lists.length; i++) {
							if (ShoppingListId != lists[i].ShoppingListId) {
								thisLists = thisLists.concat(lists[i]);
							}
						}
						setLists(thisLists);
						setEdit(null);
						setNewListName(null);
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

	const handleGetLists = async () => {
		let response;
		try {
			response = await request(accessToken, null, 'shoppinglists', 'GET');
			if (response) {
				console.log(response);
				let sortedLists = response.sort((a, b) => {
					return a.ShoppingListId - b.ShoppingListId;
				});
				console.log('sorted');
				console.log(sortedLists);

				setLists(sortedLists);
			} else {
				setLists(null);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await handleGetLists();
		setRefreshing(false);
	}, []);

	useEffect(() => {
		const getListsOnRender = async () => {
			await handleGetLists();
		};
		getListsOnRender();
	}, []);

	return (
		<Provider>
			<View style={styleSheet.container}>
				{lists ? (
					<>
						<ScrollView
							refreshControl={
								<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
							}
						>
							{lists ? (
								lists.map((list) => {
									let listId = list.ShoppingListId;
									console.log(list);
									return (
										<View key={listId}>
											<TouchableOpacity
												onPress={() => {
													navigation.navigate('List', {
														list: list,
														Return: 'Lists',
													});
												}}
												onLongPress={() => {
													setEdit(list.ShoppingListId);
													setNewListName(list.ShoppingListName);
												}}
											>
												<Card.Title title={list.ShoppingListName} />
											</TouchableOpacity>
										</View>
									);
								})
							) : (
								<></>
							)}
						</ScrollView>
						<Button
							icon='plus-circle-outline'
							labelStyle={styleSheet.addRecipeButtonLabelStyle}
							style={styleSheet.addRecipeButton}
							onPress={() => {
								setEdit(true);
								setNewList(true);
							}}
						/>
					</>
				) : (
					<Button
						mode='contained'
						labelStyle={styleSheet.buttonLabelStyle}
						style={styleSheet.button}
						onPress={() => {
							handleGetLists();
						}}
					>
						Get lists
					</Button>
				)}
			</View>
			<Portal>
				<Modal
					visible={edit}
					onDismiss={() => {
						setEdit(false);
						setNewListName(null);
						setNewList(false);
					}}
					style={styleSheet.modalStyle}
					contentContainerStyle={styleSheet.modalContainerStyle}
				>
					{edit && (
						<>
							<View style={styleSheet.listEditView}>
								<TextInput
									style={styleSheet.recipeInput}
									label={'List name' + ': '}
									value={newListName}
									multiline={true}
									mode='outlined'
									onChangeText={setNewListName}
									onSubmitEditing={() => {
										if (newList) {
											addNewList(newListName);
										} else {
											patchListName(edit, newListName);
										}
									}}
								/>
								<IconButton
									icon='check-outline'
									size={20}
									onPress={() => {
										if (newList) {
											addNewList(newListName);
										} else {
											patchListName(edit, newListName);
										}
									}}
								/>
							</View>

							{!newList && (
								<View style={styleSheet.listEditView}>
									<IconButton
										icon='delete-outline'
										size={20}
										onPress={() => {
											confirmDelete(edit);
										}}
									/>
								</View>
							)}
						</>
					)}
				</Modal>
			</Portal>
		</Provider>
	);
};

export default ListsSceen;
