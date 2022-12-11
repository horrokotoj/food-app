import { useState, useContext, useCallback, useEffect } from 'react';
import {
	View,
	ScrollView,
	RefreshControl,
	TouchableOpacity,
} from 'react-native';
import { Button } from 'react-native-paper';
import { NetworkContext } from '../context/NetworkContext';
import { AccessTokenContext } from '../context/AccessTokenContext';
import { styleSheet } from '../styleSheets/StyleSheet';
import Recipes from '../components/Recipes';

const RecipesScreen = ({ navigation }) => {
	console.log('Recipes in RecipesScreen');

	return (
		<>
			<View style={styleSheet.container}>
				<Recipes navigation={navigation} Return={'Recipes'} />

				<Button
					icon='plus-circle-outline'
					labelStyle={styleSheet.addRecipeButtonLabelStyle}
					style={styleSheet.addRecipeButton}
					onPress={() => {
						navigation.navigate('New recipe');
					}}
				/>
			</View>
		</>
	);
};

export default RecipesScreen;
