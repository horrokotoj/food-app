import { View } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import { styleSheet } from '../styleSheets/StyleSheet';
import Recipes from '../components/Recipes';

const AddMealScreen = ({ route, navigation }) => {
	const { initialDate, Return } = route.params;

	console.log(initialDate);
	return (
		<>
			<Appbar.Header style={styleSheet.appbarHeader}>
				<Appbar.BackAction
					onPress={() => {
						navigation.navigate(Return);
					}}
				/>
				<Appbar.Content title={initialDate} />
			</Appbar.Header>
			<View style={styleSheet.container}>
				<Recipes
					navigation={navigation}
					Return={'AddMeal'}
					initialDate={initialDate}
				/>
			</View>
		</>
	);
};

export default AddMealScreen;
