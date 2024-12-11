// import React from 'react';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './index';
import SignUpScreen from '../../components/Signup';
import SignInScreen from '../../components/Signin';
import ForgotPasswordScreen from '../../components/subcomponents/Resetpass';
import NewPasswordScreen from '../../components/subcomponents/Newpass';
import AgenciesScreen from '../../components/Agencies';

// console.error = () => {};

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Agencies" component={AgenciesScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
    </Stack.Navigator>
  )
}

export default AuthStack