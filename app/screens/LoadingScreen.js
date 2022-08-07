import * as React from 'react';
import { View, Text } from 'react-native';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';

const LoadingScreen = () => {
  return (
    <View>
      <ActivityIndicator animating={true} color={'blue'} size={'large'} />
    </View>
  );
};

export default LoadingScreen;
