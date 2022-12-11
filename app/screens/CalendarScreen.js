import { useContext, useState, useEffect, useCallback } from 'react';
import {
	View,
	ScrollView,
	RefreshControl,
	TouchableOpacity,
	Alert,
} from 'react-native';
import {
	Title,
	Paragraph,
	Button,
	Provider,
	Portal,
	Modal,
	TextInput,
} from 'react-native-paper';
import { NetworkContext } from '../context/NetworkContext';
import { AccessTokenContext } from '../context/AccessTokenContext';
import { InitialDateContext } from '../context/InitialDateContext';
import { SetInitialDateContext } from '../context/SetInitialDateContext';
import { styleSheet } from '../styleSheets/StyleSheet';
import { Calendar } from 'react-native-calendars';
import Recipe from '../components/Recipe';

const CalendarScreen = ({ navigation }) => {
	const [refreshing, setRefreshing] = useState(false);
	const [recipeCalendar, setRecipeCalendar] = useState(null);
	const [marked, setMarked] = useState({});
	const [selectedPeriod, setSelectedPeriod] = useState({});
	const [markedDates, setMarkedDates] = useState({});
	const [startingDay, setStartingDay] = useState(null);
	const [endingDay, setEndingDay] = useState(null);
	const [recipes, setRecipes] = useState([]);
	const [editPortions, setEditPortions] = useState(false);
	const [idToEdit, setIdToEdit] = useState(null);
	const [portions, setPortions] = useState(null);

	const accessToken = useContext(AccessTokenContext);
	const initialDate = useContext(InitialDateContext);
	const setInitialDate = useContext(SetInitialDateContext);

	const { request } = useContext(NetworkContext);

	const handleGetRecipeCalendar = async () => {
		let response;
		try {
			response = await request(accessToken, null, `recipecalendar`, 'GET');
			if (response.length > 0) {
				setRecipeCalendar(response);
			} else {
				setRecipeCalendar(null);
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleSetRecipes = (dateString) => {
		let recipes = [];

		if (recipeCalendar) {
			recipeCalendar.map((entry) => {
				if (entry.RecipeDate.slice(0, 10) == dateString) {
					recipes = recipes.concat(entry);
				}
			});
			setRecipes(recipes);
		}
	};

	const handleMarkedDates = (marked, selectedPeriod, initialDate) => {
		let thisMarkedDates = { ...marked };
		for (let key in selectedPeriod) {
			if (selectedPeriod.hasOwnProperty(key)) {
				let value = selectedPeriod[key];
				if (value.startingDay) {
					thisMarkedDates[key] = {
						...thisMarkedDates[key],
						startingDay: value.startingDay,
					};
				}
				if (value.endingDay) {
					thisMarkedDates[key] = {
						...thisMarkedDates[key],
						endingDay: value.endingDay,
					};
				}
				if (value.color) {
					thisMarkedDates[key] = {
						...thisMarkedDates[key],
						color: value.color,
					};
				}
			}
		}

		thisMarkedDates[initialDate] = {
			...thisMarkedDates[initialDate],
			startingDay: true,
			color: 'dodgerblue',
			endingDay: true,
		};
		setMarkedDates(thisMarkedDates);
	};

	const handleShortPress = (dateString) => {
		setInitialDate(dateString);
		handleMarkedDates(marked, selectedPeriod, dateString);
	};

	const handleLongPress = (day) => {
		const handleIntervall = (startingDay, startDate, endDate) => {
			let tmpSelectedPeriod = {};
			tmpSelectedPeriod[startingDay.dateString] = {
				startingDay: true,
				color: 'lightblue',
			};
			let iDate = startDate;
			iDate.setDate(iDate.getDate() + 1);
			let iDateString = iDate.toISOString().split('T')[0];
			while (iDate < endDate) {
				tmpSelectedPeriod[iDateString] = {
					startingDay: false,
					color: 'lightblue',
					endingDay: false,
				};
				iDate.setDate(iDate.getDate() + 1);
				iDateString = iDate.toISOString().split('T')[0];
			}
			tmpSelectedPeriod[iDateString] = {
				endingDay: true,
				color: 'lightblue',
			};
			return tmpSelectedPeriod;
		};
		let aDate = new Date(day.dateString);
		let thisSelectedPeriod = {};
		if (startingDay && endingDay) {
			let startDate = new Date(startingDay.dateString);
			let endDate = new Date(endingDay.dateString);
			let date = new Date(day.dateString);
			if (date < startDate) {
				thisSelectedPeriod = handleIntervall(day, date, endDate);
				setStartingDay(day);
			} else if (date > endDate) {
				thisSelectedPeriod = handleIntervall(startingDay, startDate, date);
				setEndingDay(day);
			} else {
				setStartingDay(null);
				setEndingDay(null);
			}
		} else if (startingDay) {
			let startDate = new Date(startingDay.dateString);
			let endDate = new Date(day.dateString);
			if (startDate < endDate) {
				thisSelectedPeriod = handleIntervall(startingDay, startDate, endDate);
				setEndingDay(day);
			} else if (startDate > endDate) {
				thisSelectedPeriod[day.dateString] = {
					startingDay: true,
					color: 'lightblue',
				};
				setStartingDay(day);
			}
		} else {
			thisSelectedPeriod[day.dateString] = {
				startingDay: true,
				color: 'lightblue',
			};
			setStartingDay(day);
		}
		setSelectedPeriod(thisSelectedPeriod);
		handleMarkedDates(marked, thisSelectedPeriod, initialDate);
	};

	const handleRemoveMeal = (RecipeCalendarId) => {
		if (RecipeCalendarId) {
			return Alert.alert('Meal will be removed', '', [
				// The "Yes" button
				{
					text: 'Yes',
					onPress: async () => {
						let bodyObj = {
							RecipeCalendarId: RecipeCalendarId,
						};

						if (
							await request(accessToken, bodyObj, 'recipecalendar', 'DELETE')
						) {
							let thisRecipeCalendar = [];
							for (let i = 0; i < recipeCalendar.length; i++) {
								if (recipeCalendar[i].RecipeCalendarId != RecipeCalendarId) {
									thisRecipeCalendar = thisRecipeCalendar.concat(
										recipeCalendar[i]
									);
								}
							}
							setRecipeCalendar(thisRecipeCalendar);
						} else {
							alert('Failed to remove');
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
		}
	};

	const handleEditPortions = async (RecipeCalendarId, portions) => {
		if (RecipeCalendarId && portions) {
			let obj = {
				RecipeCalendarId: RecipeCalendarId,
				Portions: portions,
			};
			let response;
			if (await request(accessToken, obj, 'recipecalendar', 'PATCH')) {
				let thisRecipeCalendar = recipeCalendar;
				for (let i = 0; i < thisRecipeCalendar.length; i++) {
					//Does not work...
					if (thisRecipeCalendar[i].RecipeCalendarId == RecipeCalendarId) {
						thisRecipeCalendar[i] = {
							...thisRecipeCalendar[i],
							Portions: portions,
						};
					}
				}
				setRecipeCalendar(thisRecipeCalendar);

				let thisRecipes = recipes;
				for (let i = 0; i < thisRecipes.length; i++) {
					//Does not work...
					if (thisRecipes[i].RecipeCalendarId == RecipeCalendarId) {
						thisRecipes[i] = {
							...thisRecipes[i],
							Portions: portions,
						};
					}
				}
				setRecipes(thisRecipes);
				setEditPortions(false);
				setPortions(null);
				setIdToEdit(null);
			} else {
				alert('Failed to edit');
			}
		}
	};

	const handleCreateList = async (startingDay, endingDay) => {
		let obj = {
			startDate: startingDay.dateString,
			endDate: endingDay.dateString,
		};
		if (await request(accessToken, obj, 'shoppinglist/intervall', 'POST')) {
			setStartingDay(null);
			setEndingDay(null);
			setSelectedPeriod({});
			handleMarkedDates(marked, null, initialDate);
		} else [alert('Post failed')];
	};

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await handleGetRecipeCalendar();
		setRefreshing(false);
	}, []);

	useEffect(() => {
		const getRecipeCalendar = async () => {
			await handleGetRecipeCalendar();
		};

		getRecipeCalendar();
	}, []);

	useEffect(() => {
		let thisMarkedDates = markedDates;
		if (initialDate) {
			thisMarkedDates[initialDate] = {
				...thisMarkedDates[initialDate],
				startingDay: true,
				color: 'dodgerblue',
				endingDay: true,
			};
		}
		handleMarkedDates(marked, selectedPeriod, initialDate);
	}, []);

	useEffect(() => {
		let thisMarked = {};
		if (recipeCalendar) {
			recipeCalendar.map((entry) => {
				let date = entry.RecipeDate.slice(0, 10);
				thisMarked[date] = {
					...thisMarked[date],
					marked: true,
					selectedColor: 'blue',
				};
			});
		}
		setMarked(thisMarked);
		handleSetRecipes(initialDate);
		handleMarkedDates(thisMarked, selectedPeriod, initialDate);
	}, [recipeCalendar]);

	// console.log(initialDate);
	// console.log(recipeCalendar);
	// console.log(recipes);
	// console.log(markedDates);
	// console.log(initialDate);
	return (
		<Provider>
			<View style={styleSheet.container}>
				<Calendar
					initialDate={initialDate}
					minDate={'2022-12-03'}
					onDayPress={(day) => {
						handleShortPress(day.dateString);
						handleSetRecipes(day.dateString);
					}}
					onDayLongPress={(day) => {
						console.log('longpress on day', day);
						handleLongPress(day);
					}}
					firstDay={1}
					showWeekNumbers={false}
					enableSwipeMonths={true}
					markingType={'period'}
					markedDates={markedDates}
				/>
				{/* <Agenda /> */}
				<ScrollView
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					}
				>
					{recipes ? (
						recipes.map((recipe) => {
							let recipeId = recipe.RecipeId;
							return (
								<View key={recipeId} style={styleSheet.calendarRecipeView}>
									<TouchableOpacity
										style={styleSheet.recipeTouchable}
										onPress={() => {
											navigation.navigate('Recipe', {
												Recipe: recipe,
												Return: 'Calendar',
											});
										}}
										onLongPress={() => {
											handleRemoveMeal(recipe.RecipeCalendarId);
										}}
									>
										<Recipe recipe={recipe} />
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => {
											setEditPortions(true);
											setIdToEdit(recipe.RecipeCalendarId);
										}}
									>
										<Title>Portions</Title>
										<Paragraph>{recipe.Portions}</Paragraph>
									</TouchableOpacity>
								</View>
							);
						})
					) : (
						<></>
					)}
				</ScrollView>

				<View style={styleSheet.calendarButtonsContainer}>
					<Button
						labelStyle={styleSheet.addMealButtonLabelStyle}
						style={styleSheet.addMealButton}
						onPress={() => {
							navigation.navigate('AddMeal', {
								initialDate: initialDate,
								Return: 'Calendar',
							});
						}}
					>
						Add meal
					</Button>
					<Button
						labelStyle={styleSheet.addMealButtonLabelStyle}
						style={styleSheet.addMealButton}
						onPress={() => {
							if (startingDay && endingDay) {
								handleCreateList(startingDay, endingDay);
							} else {
								alert(
									'Mark period by longpressing a start day and an end day.'
								);
							}
						}}
					>
						Create list
					</Button>
				</View>
			</View>
			<Portal>
				<Modal
					visible={editPortions}
					onDismiss={() => {
						setEditPortions(false);
						setPortions(null);
					}}
					style={styleSheet.modalStyle}
					contentContainerStyle={styleSheet.modalContainerStyle}
				>
					<TextInput
						style={styleSheet.calendarPortionsInput}
						value={portions}
						mode='outlined'
						label='# portions'
						multiline={false}
						keyboardType={'numeric'}
						onChangeText={setPortions}
					/>
					<View style={styleSheet.calendarButtonsContainer}>
						<Button
							labelStyle={styleSheet.editPortionsButtonLabelStyle}
							style={styleSheet.editPortionsButton}
							onPress={() => {
								handleEditPortions(idToEdit, portions);
							}}
						>
							edit
						</Button>
						<Button
							labelStyle={styleSheet.editPortionsButtonLabelStyle}
							style={styleSheet.editPortionsButton}
							onPress={() => {
								setPortions(null);
								setEditPortions(false);
							}}
						>
							Cancel
						</Button>
					</View>
				</Modal>
			</Portal>
		</Provider>
	);
};

export default CalendarScreen;
