import { useContext } from 'react';
import { View } from 'react-native';
import { Drawer } from 'react-native-paper';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { AuthContext } from '../context/AuthContext';
import { AccessTokenContext } from '../context/AccessTokenContext';

export default function DrawerContent(props) {
	const { signOut } = useContext(AuthContext);
	const accessToken = useContext(AccessTokenContext);

	return (
		<View style={{ flex: 1 }}>
			<DrawerContentScrollView {...props}>
				<View>
					<Drawer.Section>
						{/* <DrawerItem
							label={'Home'}
							onPress={() => props.navigation.navigate('Home')}
							icon={({ color, size }) => (
								<Ionicons name='home' color={color} size={size} />
							)}
						/> */}
						<DrawerItem
							label={'Calendar'}
							onPress={() => props.navigation.navigate('Calendar', {})}
							icon={({ color, size }) => (
								<Ionicons name='calendar' color={color} size={size} />
							)}
						/>
						<DrawerItem
							label={'Recipes'}
							onPress={() => props.navigation.navigate('Recipes')}
							icon={({ color, size }) => (
								<Ionicons name='document-text' color={color} size={size} />
							)}
						/>
						<DrawerItem
							label={'Lists'}
							onPress={() => props.navigation.navigate('Lists')}
							icon={({ color, size }) => (
								<Ionicons name='list-outline' color={color} size={size} />
							)}
						/>
						<DrawerItem
							label={'House hold'}
							onPress={() => props.navigation.navigate('House hold')}
							icon={({ color, size }) => (
								<Ionicons name='home' color={color} size={size} />
							)}
						/>
					</Drawer.Section>
				</View>
			</DrawerContentScrollView>

			<Drawer.Section>
				<DrawerItem
					label={'Signout'}
					onPress={() => {
						signOut(accessToken);
					}}
					icon={({ color, size }) => (
						<Ionicons name='log-out' color={color} size={size} />
					)}
				/>
			</Drawer.Section>
		</View>
	);
}
