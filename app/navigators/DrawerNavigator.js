import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import RecipesScreen from '../screens/RecipesScreen';
import ListsScreen from '../screens/ListsScreen';
import AddMealScreen from '../screens/AddMealScreen';
import RecipeScreen from '../screens/RecipeScreen';
import ListScreen from '../screens/ListScreen';
import HouseHoldScreen from '../screens/HouseHoldScreen';
import NewRecipeScreen from '../screens/NewRecipeScreen';
import DrawerContent from '../screens/DrawerContent';

import { useState } from 'react';
import moment from 'moment';

import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
	const [initialDate, setInitialDate] = useState(moment().format('YYYY-MM-DD'));

	return (
		<Drawer.Navigator
			useLegacyImplementation={true}
			drawerContent={(props) => <DrawerContent {...props} />}
			screenOptions={{ unmountOnBlur: true }}
		>
			{/* <Drawer.Screen name={'Home'} component={HomeScreen} /> */}
			<Drawer.Screen name={'Calendar'} component={CalendarScreen} />
			<Drawer.Screen name={'Recipes'} component={RecipesScreen} />
			<Drawer.Screen name={'Lists'} component={ListsScreen} />
			<Drawer.Screen name={'AddMeal'} component={AddMealScreen} />
			<Drawer.Screen name={'Recipe'} component={RecipeScreen} />
			<Drawer.Screen name={'List'} component={ListScreen} />
			<Drawer.Screen name={'House hold'} component={HouseHoldScreen} />
			<Drawer.Screen name={'New recipe'} component={NewRecipeScreen} />
		</Drawer.Navigator>
	);
}
