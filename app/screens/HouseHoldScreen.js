import { useState, useContext, useCallback, useEffect } from 'react';
import { View, ScrollView, RefreshControl, Text } from 'react-native';
import { Title, Card, Button } from 'react-native-paper';
import { NetworkContext } from '../context/NetworkContext';
import { AccessTokenContext } from '../context/AccessTokenContext';
import { styleSheet } from '../styleSheets/StyleSheet';

const HouseHoldScreen = ({ navigation }) => {
	const [inHouseHold, setInHouseHold] = useState(false);
	const [houseHoldId, setHouseHoldId] = useState(null);
	const [houseHoldName, setHouseHoldName] = useState(null);
	const [refreshing, setRefreshing] = useState(false);
	const accessToken = useContext(AccessTokenContext);
	const { request } = useContext(NetworkContext);

	const handleGetHouseHoldId = async () => {
		let response;
		try {
			response = await request(accessToken, null, 'household', 'GET');
			if (response) {
				console.log(response);
				if (response[0].HouseHoldId && response[0].HouseHoldName) {
					setInHouseHold(true);
					setHouseHoldId(response[0].HouseHoldId);
					setHouseHoldName(response[0].HouseHoldName);
				} else {
					setInHouseHold(false);
					setHouseHoldId(null);
					setHouseHoldName(null);
				}
			} else {
				setInHouseHold(false);
				setHouseHoldName(null);
				setHouseHoldId(null);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await handleGetHouseHoldId();
		setRefreshing(false);
	}, []);

	useEffect(() => {
		const getHouseHoldIdOnRender = async () => {
			await handleGetHouseHoldId();
		};
		getHouseHoldIdOnRender();
	}, []);

	return (
		<>
			<View style={styleSheet.container}>
				<ScrollView
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					}
				>
					{inHouseHold && houseHoldName ? (
						<>
							<Text>Du tillhör household {houseHoldName}</Text>
						</>
					) : (
						<>
							<Text>Du tillhör inget household</Text>
						</>
					)}
				</ScrollView>
			</View>
		</>
	);
};

export default HouseHoldScreen;
