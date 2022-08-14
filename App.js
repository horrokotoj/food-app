import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { View, SafeAreaView } from 'react-native';

import Navigator from './app/navigators/Navigator';
import { styleSheet } from './app/styleSheets/StyleSheet';

export default function App() {
  return (
    <SafeAreaView style={styleSheet.appContainer}>
      <Navigator />
      <StatusBar style='auto' />
    </SafeAreaView>
  );
}
