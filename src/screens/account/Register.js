import React, {useRef, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Icon, Input} from 'react-native-elements';
import Loading from '../../components/Loading';
import {Formik} from 'formik';
import * as yup from 'yup';
import Toast from 'react-native-easy-toast';
import {useAuth} from '../../lib/auth';
import {useNavigation} from '@react-navigation/native';
import accountImage from '../../images/character_icons_7.png';
import {auth} from '../../firebase';

const Register = () => {
  const {logout} = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const {register} = useAuth();
  const toastRef = useRef();

  const schema = yup.object().shape({
    displayName: yup.string().required('Ingrese el nombre de la fundación'),
    email: yup
      .string()
      .email('Ingrese un email valido')
      .required('El campo email es requerido'),
    password: yup
      .string()
      .min(
        8,
        ({min}) => `La contraseña debe contener al menos ${min} caracteres`,
      )
      .required('Contraseña requerida'),
  });

  const loginScreen = () => {
    navigation.navigate('login');
  };

  const onFinish = async data => {
    try {
      setLoading(true);
      await register({
        ...data,
      });

      await auth.currentUser.updateProfile({displayName: data.displayName});

      await auth.currentUser
        .sendEmailVerification()
        .then(
          toastRef.current.show(
            'Se ha enviado un email de verificación a tu correo electrónico',
          ),
        );
      logout;
    } catch (error) {
      setLoading(false);
      const errorCode = error.code;
      toastRef.current.show(errorCode);
    }
  };

  return (
    <ScrollView>
      <View style={styles.formContainer}>
        <Text style={styles.text}>Registra tu cuenta</Text>
        <Text style={styles.textLogin}>¿Ya tienes una cuenta?</Text>
        <TouchableOpacity onPress={loginScreen} style={styles.loginText}>
          <Text style={styles.loginText}>Inicia sesión</Text>
        </TouchableOpacity>

        <Image source={accountImage} style={styles.logo} resizeMode="contain" />

        <Formik
          validationSchema={schema}
          initialValues={{displayName: '', email: '', password: ''}}
          onSubmit={onFinish}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            isValid,
          }) => (
            <>
              <Input
                name="displayName"
                placeholder="Nombre de usuario"
                containerStyle={styles.inputForm}
                onChangeText={handleChange('displayName')}
                onBlur={handleBlur('displayName')}
                value={values.name}
                rightIcon={
                  <Icon
                    type="material-community"
                    name="account-outline"
                    iconStyle={styles.iconRight}
                  />
                }
              />
              {errors.displayName && (
                <Text style={styles.errorMessage}>{errors.displayName}</Text>
              )}
              <Input
                name="email"
                placeholder="Dirección de correo electrónico"
                containerStyle={styles.inputForm}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                keyboardType="email-address"
                rightIcon={
                  <Icon
                    type="material-community"
                    name="at"
                    iconStyle={styles.iconRight}
                  />
                }
              />
              {errors.email && (
                <Text style={styles.errorMessage}>{errors.email}</Text>
              )}
              <Input
                name="password"
                placeholder="Contraseña"
                style={styles.textInput}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                password={true}
                secureTextEntry={!showPassword}
                // onChange={e => onChange(e, 'password')}
                rightIcon={
                  <Icon
                    type="material-community"
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    iconStyle={styles.iconRight}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
              {errors.password && (
                <Text style={styles.errorMessage}>{errors.password}</Text>
              )}

              <Button
                onPress={handleSubmit}
                title="Registrarme"
                disabled={!isValid}
                containerStyle={styles.btnContainerLogin}
                buttonStyle={{backgroundColor: '#a061a8'}}
              />
            </>
          )}
        </Formik>
        <Loading isVisible={loading} text="Creando una cuenta" />
        <Toast ref={toastRef} position="center" opacity={0.9} />
      </View>
    </ScrollView>
  );
};

export default Register;

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  inputForm: {
    width: '100%',
    marginTop: 10,
  },
  btnContainerLogin: {
    marginTop: 10,
    width: '70%',
    backgroundColor: '#00a680',
  },
  miniatureStyle: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  iconRight: {
    color: '#c1c1c1',
  },
  errorMessage: {
    fontSize: 10,
    color: 'red',
  },
  text: {
    textAlign: 'center',
    margin: 10,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#000',
  },
  logo: {
    height: 100,
    marginTop: 10,
    width: 100,
  },
  textLogin: {
    fontSize: 20,
    textAlign: 'center',
  },
  loginText: {
    textAlign: 'center',
    color: '#396EB0',
    height: 30,
    fontSize: 20,
  },
  backIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
    shadowColor: 'black',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.5,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
    marginTop: 20,
  },
  viewImages: {
    flexDirection: 'row',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  containerIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    height: 60,
    width: 60,
    backgroundColor: '#e3e3e3',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 18,
    color: '#7a7a7a',
  },
});
