import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/account/Login';
import Register from '../screens/account/Register';

const Stack = createStackNavigator();

export default function AccountStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="login"
        component={Login}
        options={{title: 'Iniciar sesión'}}
      />
      <Stack.Screen
        name="register"
        component={Register}
        options={{title: 'Registro'}}
      />
    </Stack.Navigator>
  );
}
