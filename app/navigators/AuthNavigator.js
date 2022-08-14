import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

// A stack navigator for authentication pages
const AuthStack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ header: () => null }}>
      <AuthStack.Screen name='LoginScreen' component={LoginScreen} />
      <AuthStack.Screen name='SignupScreen' component={SignupScreen} />
    </AuthStack.Navigator>
  );
};

export default AuthNavigator;
