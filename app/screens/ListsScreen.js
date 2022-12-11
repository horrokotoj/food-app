import { useState, useContext, useCallback, useEffect } from 'react';
import {
	View,
	ScrollView,
	RefreshControl,
	TouchableOpacity,
} from 'react-native';
import { Title, Card, Button } from 'react-native-paper';
import { NetworkContext } from '../context/NetworkContext';
import { AccessTokenContext } from '../context/AccessTokenContext';
import { styleSheet } from '../styleSheets/StyleSheet';

const ListsSceen = ({ navigation }) => {
	const [lists, setLists] = useState(null);
	const [refreshing, setRefreshing] = useState(false);
	const accessToken = useContext(AccessTokenContext);
	const { request } = useContext(NetworkContext);

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
		<>
			<View style={styleSheet.container}>
				{lists ? (
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
				) : (
					<Button
						mode='contained'
						labelStyle={styleSheet.buttonLabelStyle}
						style={styleSheet.button}
						onPress={() => {
							handleGetRecipes();
						}}
					>
						Get lists
					</Button>
				)}
			</View>
		</>
	);
};

export default ListsSceen;
