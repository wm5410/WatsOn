/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
 

import MapScreen from './src/screens/MapScreen';
// import your other screens when ready:
// import CreateEventScreen from './src/screens/CreateEventScreen';
// import EventDetailScreen from './src/screens/EventDetailScreen';

const Stack = createNativeStackNavigator();


function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Stack.Navigator initialRouteName="Map">
          <Stack.Screen name="Map" component={MapScreen} />
          {/* Example extra screens: */}
          {/* <Stack.Screen name="Create" component={CreateEventScreen} /> */}
          {/* <Stack.Screen name="Event" component={EventDetailScreen} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
