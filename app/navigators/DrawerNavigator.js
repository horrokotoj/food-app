import HomeScreen from '../screens/HomeScreen';
import RecipesScreen from '../screens/RecipesScreen';
import RecipeScreen from '../screens/RecipeScreen';
import DrawerContent from '../screens/DrawerContent';
import RecipeNavigator from '../navigators/RecipeNavigator';

import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      useLegacyImplementation={true}
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{ unmountOnBlur: true }}
    >
      <Drawer.Screen name={'Home'} component={HomeScreen} />
      <Drawer.Screen name={'Recipes'} component={RecipesScreen} />
      <Drawer.Screen name={'Recipe'} component={RecipeScreen} />
    </Drawer.Navigator>
  );
}
