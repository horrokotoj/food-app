import { useState, useContext, useCallback, useEffect } from 'react';
import { View, ScrollView, RefreshControl, Text } from 'react-native';
import {
	Title,
	Card,
	Button,
	Avatar,
	List,
	Provider,
	Portal,
	Modal,
	IconButton,
	TextInput,
} from 'react-native-paper';
import { NetworkContext } from '../context/NetworkContext';
import { AccessTokenContext } from '../context/AccessTokenContext';
import { styleSheet } from '../styleSheets/StyleSheet';
import { Calendar } from 'react-native-calendars';

const HouseHoldScreen = ({ navigation }) => {
	const [inHouseHold, setInHouseHold] = useState(false);
	const [houseHold, setHouseHold] = useState(null);
	const [invite, setInvite] = useState(false);
	const [inviteName, setInviteName] = useState(null);
	const [refreshing, setRefreshing] = useState(false);
	const accessToken = useContext(AccessTokenContext);
	const { request } = useContext(NetworkContext);

	const inviteUser = async (userName) => {
		let obj = {
			userName: userName,
		};
		try {
			if (await request(accessToken, obj, `householdinvite`, 'POST')) {
				setInvite(false);
				setInviteName(null);
			} else {
				console.log('failed to add new');
				alert('Failed to invite user');
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleGetHouseHoldId = async () => {
		let response;
		try {
			response = await request(accessToken, null, 'household', 'GET');
			if (response) {
				console.log(response);
				if (
					response[0] &&
					response[0].HouseHoldId &&
					response[0].HouseHoldName
				) {
					setInHouseHold(true);
					setHouseHold(response);
				} else {
					setInHouseHold(false);
					setHouseHold(null);
				}
			} else {
				setInHouseHold(false);
				setHouseHold(null);
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
		<Provider>
			<View style={styleSheet.container}>
				{inHouseHold && houseHold ? (
					<>
						<Card>
							<Card.Title
								title={houseHold[0].HouseHoldName}
								subtitle='Medlemmar i hushållet'
								left={(props) => (
									<Avatar.Icon
										{...props}
										style={{ backgroundColor: 'dodgerblue' }}
										icon='home'
									/>
								)}
							/>
						</Card>
						<ScrollView
							refreshControl={
								<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
							}
						>
							{houseHold.map((index) => {
								return (
									<List.Item
										key={index.UserName}
										title={index.UserName}
										description='Item description'
									/>
								);
							})}
						</ScrollView>
						<View style={styleSheet.calendarButtonsContainer}>
							<Button
								labelStyle={styleSheet.addMealButtonLabelStyle}
								style={styleSheet.addMealButton}
								onPress={() => {
									alert();
								}}
							>
								Lämna
							</Button>
							<Button
								labelStyle={styleSheet.addMealButtonLabelStyle}
								style={styleSheet.addMealButton}
								onPress={() => {
									setInvite(true);
								}}
							>
								Bjud in
							</Button>
						</View>
					</>
				) : (
					<>
						<Text>Du tillhör inget hushåll</Text>
					</>
				)}
			</View>
			<Portal>
				<Modal
					visible={invite}
					onDismiss={() => {
						setInvite(false);
					}}
					style={styleSheet.modalStyle}
					contentContainerStyle={styleSheet.modalContainerStyle}
				>
					<>
						<View style={styleSheet.listEditView}>
							<TextInput
								style={styleSheet.recipeInput}
								label={'Username' + ': '}
								value={inviteName}
								multiline={true}
								mode='outlined'
								onChangeText={setInviteName}
								onSubmitEditing={() => {
									inviteUser(inviteName);
								}}
							/>
							<IconButton
								icon='check-outline'
								size={20}
								onPress={() => {
									inviteUser(inviteName);
								}}
							/>
						</View>
					</>
				</Modal>
			</Portal>
		</Provider>
	);
};

export default HouseHoldScreen;
