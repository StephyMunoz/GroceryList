import React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import loginIcon from '../images/shopping.png';
import {Button, Icon, Input} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();

  const RegisterScreen = () => {
    navigation.navigate('register');
  };

  const loginScreen = () => {
    navigation.navigate('login');
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.name}>
        <Text style={styles.text}>KWIK-E-MART</Text>
      </View>
      <View style={styles.imagen}>
        <Image source={loginIcon} style={styles.logo} />
      </View>
      <View style={styles.buttons}>
        <Button
          buttonStyle={styles.btn1}
          title="Ingresar"
          onPress={loginScreen}
        />
        <Button
          buttonStyle={styles.btn1}
          title="Registrarse"
          onPress={RegisterScreen}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    backgroundColor: 'lightgray',
  },
  name: {
    marginVertical: 20,
  },
  imagen: {
    flex: 1,
  },
  buttons: {
    flex: 1,
    marginTop: 70,
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: 300,
    marginBottom: 30,
    height: 20,
  },
  btn1: {
    height: 60,
    backgroundColor: 'blue',
    fontSize: 30,
  },

  text: {
    textAlign: 'center',
    margin: 20,
    fontWeight: 'bold',
    fontSize: 50,
    color: 'green',
    fontFamily: 'Cochin',
  },
  logo: {
    height: 270,
    marginTop: 10,
    width: 300,
  },
});

export default Home;
