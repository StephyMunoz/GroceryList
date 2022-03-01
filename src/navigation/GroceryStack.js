import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/account/Login';
import Register from '../screens/account/Register';
import GroceryList from '../screens/grocery/GroceryList';
import ListForm from '../screens/grocery/ListForm';
import ListDetail from '../screens/grocery/ListDetail';

const Stack = createStackNavigator();

export default function GroceryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="grocery_list"
        component={GroceryList}
        options={{title: 'Listas de compras'}}
      />
      <Stack.Screen
        name="form_add_list"
        component={ListForm}
        options={{title: 'Agregar lista'}}
      />
      <Stack.Screen name="list_detail" component={ListDetail} />
    </Stack.Navigator>
  );
}
