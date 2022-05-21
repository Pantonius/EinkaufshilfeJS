import * as React from 'react';
import { NavigationContainer} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import ScannerScreen from './src/screens/ScannerScreen';
import AddItemModal from './src/screens/AddItemModal';
import RemoveItemModal from './src/screens/RemoveItemModal';
import ItemOfTypeScreen from './src/screens/ItemOfTypeScreen';
import EditItemModal from './src/screens/EditItemModal';
import CameraModal from './src/screens/CameraModal';
import LoginScreen from './src/screens/LoginScreen';
import ShoppingListScreen from './src/screens/ShoppingListScreen';

import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from './src/util/firebase';
import AccountScreen from './src/screens/AccountScreen';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Group>
          <Stack.Screen name='Home' component={HomeScreen} options={({ navigation }) => ({ headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Account') }>
              <FontAwesome5Icon name='user' style={{ fontSize: 24, }} />
            </TouchableOpacity>
          ), })} />
          <Stack.Screen name='Scanner' component={ScannerScreen} initialParams={{ addItem: true }} />
          <Stack.Screen name='Items' component={ItemOfTypeScreen} options={({route}) => ({ title: 'Alle "' + route.params.name + '"' })} />
          <Stack.Screen name='Account' component={AccountScreen} options={({ navigation }) => ({ headerRight: () => (
            <TouchableOpacity onPress={() => {
              signOut(auth);
              navigation.replace('Login');
            }}>
              <Icon name='logout' style={{ fontSize: 24, }} />
            </TouchableOpacity>
          ), })} />
          <Stack.Screen name='ShoppingList' component={ShoppingListScreen} options={{ title: 'Einkaufsliste' }} />
        </Stack.Group>
        <Stack.Group screenOptions={{ headerShown: false }}>
          <Stack.Screen name='Login' component={LoginScreen} />
        </Stack.Group>
        <Stack.Group screenOptions={{presentation: 'modal' }}>
          <Stack.Screen name='AddItem' component={AddItemModal} options={{ title: 'Hinzufügen' }} />
          <Stack.Screen name='EditItem' component={EditItemModal} options={({route}) => ({ title: route.params.name })} />
          <Stack.Screen name='RemoveItem' component={RemoveItemModal} options={{ title: 'Entfernen' }} />
        </Stack.Group>
        <Stack.Group screenOptions={{presentation: 'fullScreenModal', headerShown: false }}>
          <Stack.Screen name='Camera' component={CameraModal} options={{ title: 'Kamera' }} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}