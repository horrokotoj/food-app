import { Image } from 'react-native';
import { Avatar, List, IconButton } from 'react-native-paper';
import { styleSheet } from '../styleSheets/StyleSheet';

const RecipeStep = ({ step }) => {
  return <List.Item title={step.Step + '. ' + step.StepDesc} />;
};

export default RecipeStep;
