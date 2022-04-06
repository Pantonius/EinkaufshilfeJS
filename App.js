import * as React from 'react';
import { NavigationContainer} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import ScannerScreen from './src/screens/ScannerScreen';
import AddItemModal from './src/screens/AddItemModal';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Group>
          <Stack.Screen name='Home' component={HomeScreen} />
          <Stack.Screen name='Scanner' component={ScannerScreen} />
        </Stack.Group>
        <Stack.Group screenOptions={{presentation: 'modal' }}>
          <Stack.Screen name='AddItem' component={AddItemModal} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}