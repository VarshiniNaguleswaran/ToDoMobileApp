import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeTaskList from './components/HomeTaskList';
import AddTask from './components/AddTask';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TaskList">
        <Stack.Screen name="HomeTaskList" component={HomeTaskList} />
        <Stack.Screen name="AddTask" component={AddTask} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
