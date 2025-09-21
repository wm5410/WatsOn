import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import all your screens
import MapScreen from './src/screens/MapScreen';
import CreateEventScreen from './src/screens/CreateEventScreen';
import EventDetailScreen from './src/screens/EventDetailScreen';
import LoginScreen from './src/screens/LoginScreen'; // Make sure this is imported

const Stack = createNativeStackNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Stack.Navigator 
            initialRouteName="Map" 
            screenOptions={{ 
            headerShown: false, 
            animation: 'fade_from_bottom'
          }}>
          <Stack.Screen name="Map" component={MapScreen} options={{ headerShown: false }}  />
          <Stack.Screen name="Create" component={CreateEventScreen} options={{ title: 'Create a New Event' }} />
          <Stack.Screen name="Event" component={EventDetailScreen} options={{ title: 'Event Details' }} />
          <Stack.Screen name="Login" component={LoginScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;