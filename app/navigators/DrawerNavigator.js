import HomeScreen from '../screens/HomeScreen';
import RecipesScreen from '../screens/RecipesScreen';
import DrawerContent from '../screens/DrawerContent';

import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      useLegacyImplementation={true}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen name={'Home'} component={HomeScreen} />
      <Drawer.Screen name={'Recipes'} component={RecipesScreen} />
    </Drawer.Navigator>
  );
}
