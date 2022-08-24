import { Image } from 'react-native';
import { Avatar, List, IconButton } from 'react-native-paper';
import { styleSheet } from '../styleSheets/StyleSheet';

const RecipeIngredient = ({ ingredient }) => {
  return (
    <List.Item
      title={ingredient.IngredientName}
      description={ingredient.Quantity + ' ' + ingredient.MeasurementName}
    />
  );
};

export default RecipeIngredient;
