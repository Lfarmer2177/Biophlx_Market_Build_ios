import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/Login';
import WorkoutScreen from './workoutScreen';
import HomeScreen from './src/HomeScreen';
import ScreenB from './src/Workout Log';
import BoxScreen from './src/Tutorials';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="WorkoutScreen" component={WorkoutScreen} />
        <Stack.Screen name="Workout Log" component={ScreenB} />
        <Stack.Screen name="Tutorials" component={BoxScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;