// Gestion conditionnelle de expo-dev-client
const loadDevClient = async () => {
  if (process.env.NODE_ENV === 'development') {
    try {
      await import('expo-dev-client');
    } catch (error) {
      console.log('expo-dev-client non disponible en production');
    }
  }
};
loadDevClient();

import { registerRootComponent } from 'expo';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from './theme';
import { AuthProvider } from './context/AuthContext';

import HomeScreen from './screens/HomeScreen';
import PostScreen from './screens/PostScreen';
import ProfileScreen from './screens/ProfileScreen';
import NewPostScreen from './screens/NewPostScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <AuthProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: '#f9f9f9' }
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Post" component={PostScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="NewPost" component={NewPostScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  );
}

export default registerRootComponent(App); 