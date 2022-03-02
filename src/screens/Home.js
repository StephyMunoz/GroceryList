import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import loginIcon from '../images/shopping.png';
import {Button} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();

  const RegisterScreen = () => {
    navigation.navigate('accountlogin', {screen: 'register'});
  };

  const loginScreen = () => {
    navigation.navigate('accountlogin', {screen: 'login'});
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.name}>
        <Text style={styles.text}>KWIK-E-MART</Text>
      </View>
      <View style={styles.imagen}>
        <Image source={loginIcon} style={styles.logo} />
      </View>
      <View>
        <Text style={styles.infoText}>
          Esta es una aplicación que te facilitará tu lista de compras
        </Text>
        <Text style={styles.infoText}>
          solo debes agregar el producto que necesitas y listo!
        </Text>
        <Text style={styles.infoText}>
          Puedes llevar tu lista de compras a donde quiera que vayas.
        </Text>
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
    backgroundColor: '#bd4772',
  },
  name: {
    marginVertical: 20,
  },
  infoText: {
    // marginTop: 50,
    fontSize: 15,
    color: '#fff',
    marginLeft: 20,
    marginRight: 20,
  },
  imagen: {
    flex: 1,
  },
  buttons: {
    flex: 1,
    marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: 300,
    marginBottom: 30,
    height: 20,
  },
  btn1: {
    height: 60,
    backgroundColor: '#57a5e5',
    fontSize: 30,
  },
  text: {
    textAlign: 'center',
    margin: 20,
    fontWeight: 'bold',
    fontSize: 40,
    color: '#8de09f',
    fontFamily: 'Cochin',
  },
  logo: {
    height: 150,
    marginBottom: 30,
    width: 150,
  },
});

export default Home;
