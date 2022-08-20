import { useContext } from 'react';
import { View } from 'react-native';
import { Drawer } from 'react-native-paper';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { AuthContext } from '../context/AuthContext';

export default function DrawerContent(props) {
  const { signOut } = useContext(AuthContext);
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View>
          <Drawer.Section>
            <DrawerItem
              label={'Home'}
              onPress={() => props.navigation.navigate('Home')}
              icon={({ color, size }) => (
                <Ionicons name='home' color={color} size={size} />
              )}
            />
            <DrawerItem
              label={'Recipes'}
              onPress={() => props.navigation.navigate('Recipes')}
              icon={({ color, size }) => (
                <Ionicons name='document-text' color={color} size={size} />
              )}
            />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>

      <Drawer.Section>
        <DrawerItem
          label={'Signout'}
          onPress={() => {
            signOut();
          }}
          icon={({ color, size }) => (
            <Ionicons name='log-out' color={color} size={size} />
          )}
        />
      </Drawer.Section>
    </View>
  );
}
