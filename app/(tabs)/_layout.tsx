import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

import AuthStack from './AuthStack';
import Dashboard from './DashboardPages';

const Stack = createStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const profile = await AsyncStorage.getItem('profile_type');
        
        if (token && profile) {
          // Optionally: validate token expiry here (advanced)
          setInitialRoute('Dashboard');
        } else {
          setInitialRoute('Auth');
        }
      } catch (err) {
        console.error('Error checking login status:', err);
        setInitialRoute('Auth');
      }
    };

    checkLoginStatus();
  }, []);

  if (initialRoute === null) {
    // Still loading
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
        <Stack.Screen name="Auth" component={AuthStack} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
      </Stack.Navigator>
  );
}
