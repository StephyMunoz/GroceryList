import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import GroceryList from '../screens/grocery/GroceryList';
import ListForm from '../screens/grocery/ListForm';
import ListDetail from '../screens/grocery/ListDetail';
import EditGroceryList from '../screens/grocery/EditGroceryList';

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
      <Stack.Screen
        name="edit_list"
        component={EditGroceryList}
        options={{title: 'Editar lista'}}
      />
    </Stack.Navigator>
  );
}
