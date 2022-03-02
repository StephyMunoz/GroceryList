import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-elements';
import {useAuth} from '../lib/auth';
import Home from '../screens/Home';
import LoginStack from './LoginStack';
import EditProfileOptionsUser from '../screens/account/EditProfileOptionsUser';
import GroceryStack from './GroceryStack';

const Tab = createBottomTabNavigator();

const Navigation = () => {
  const {user} = useAuth();
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="home"
        screenOptions={({route}) => ({
          tabBarIcon: ({color}) => screenOptions(route, color),
          headerShown: false,
          tabBarInactiveTintColor: '#646464',
          tabBarActiveTintColor: '#a061a8',
        })}>
        {!user && (
          <>
            <Tab.Screen
              name="home"
              component={Home}
              options={{title: 'Inicio'}}
            />
            <Tab.Screen
              name="accountlogin"
              component={LoginStack}
              options={{title: 'Registro'}}
            />
          </>
        )}
        {user && (
          <>
            <Tab.Screen
              name="grocery"
              component={GroceryStack}
              options={{title: 'Lista de compras'}}
            />
            <Tab.Screen
              name="profile"
              component={EditProfileOptionsUser}
              options={{title: 'Perfil'}}
            />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

function screenOptions(route, color) {
  let iconName;

  switch (route.name) {
    case 'home':
      iconName = 'home';
      break;
    case 'search':
      iconName = 'magnify';
      break;
    case 'grocery':
      iconName = 'cart-variant';
      break;
    case 'accountlogin':
      iconName = 'account-outline';
      break;
    case 'profile':
      iconName = 'account-outline';
      break;
    default:
      break;
  }
  return (
    <Icon type="material-community" name={iconName} size={22} color={color} />
  );
}
