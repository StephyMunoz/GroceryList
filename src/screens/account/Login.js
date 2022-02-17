import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Icon, Input} from 'react-native-elements';
import Loading from '../../components/Loading';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useAuth} from '../../lib/auth';
import {useNavigation} from '@react-navigation/native';
import loginIcon from '../../images/hero_illustration.png';
import {auth} from '../../firebase';
import Modal from '../../components/Modal';
import Toast from 'react-native-easy-toast';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(null);
  const [isVisible, setIsVisible] = useState(null);
  const {login, user} = useAuth();
  const toastRef = useRef();
  const navigation = useNavigation();

  const schema = yup.object().shape({
    email: yup
      .string()
      .email('Please enter valid email')
      .required('Email Address is Required'),
    password: yup
      .string()
      .min(8, ({min}) => `Password must be at least ${min} characters`)
      .required('Password is required'),
  });

  const schemaVerify = yup.object().shape({
    email: yup
      .string()
      .email('Ingrese un email válido')
      .required('Dirección de correo necesario'),
  });

  const loginScreen = () => {
    navigation.navigate('register');
  };

  const onFinishLog = data => {
    setLoading(true);
    try {
      login(data.email, data.password);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  if (user === null) {
    setLoading(true);
    setLoadingText('Verificando sesión');
    return <Loading isVisible={true} text="Verificando sesión" />;
  }

  const resetPassword = () => {
    Alert.alert(
      'Reestablecer contraseña',
      'Se enviará un mail para resetar la contraseña',
      [{text: 'Cancelar'}, {text: 'Reestablecer', onPress: sendEmail}],
    );
  };

  const sendEmail = () => {
    setIsVisible(true);
  };

  const onFinish2 = data => {
    auth
      .sendPasswordResetEmail(data.email)
      .then(
        toastRef.current.show('Email enviado al correo ingresado', 1000),
        setIsVisible(false),
      );
  };

  return (
    <View style={styles.formContainer}>
      <Text style={styles.text}>Inicia sesión</Text>
      <Text style={styles.textLogin}>¿Aún no tienes una cuenta?</Text>
      <TouchableOpacity onPress={loginScreen} style={styles.loginButton}>
        <Text style={styles.loginText}>Registrate</Text>
      </TouchableOpacity>
      <Image source={loginIcon} style={styles.logo} />
      <Formik
        validationSchema={schema}
        initialValues={{email: '', password: ''}}
        onSubmit={onFinishLog}>
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
              name="email"
              placeholder="Ingresa tu email"
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
            {errors.email && <Text style={styles.message}>{errors.email}</Text>}
            <Input
              name="password"
              placeholder="Ingresa tu contraseña"
              style={styles.textInput}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              password={true}
              secureTextEntry={!showPassword}
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
              <Text style={styles.message}>{errors.password}</Text>
            )}
            <Button
              onPress={handleSubmit}
              title="Inicia sesión"
              disabled={!isValid}
              containerStyle={styles.btnContainerLogin}
            />
          </>
        )}
      </Formik>
      <TouchableOpacity onPress={resetPassword} style={styles.loginButton}>
        <Text style={styles.loginText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
      <Loading isVisible={loading} text={loadingText} />
      <Modal isVisible={isVisible} setIsVisible={setIsVisible}>
        <Text style={styles.password}>Reestablecimiento de contraseña</Text>
        <Formik
          validationSchema={schemaVerify}
          initialValues={{email: ''}}
          onSubmit={onFinish2}>
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
                <Text style={styles.message}>{errors.email}</Text>
              )}

              <Button
                onPress={handleSubmit}
                title="Enviar email"
                disabled={!isValid}
                containerStyle={styles.btnContainerLogin}
                loading={loading}
              />
            </>
          )}
        </Formik>
      </Modal>
      <Toast ref={toastRef} position="center" opacity={0.9} />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  inputForm: {
    width: '100%',
    marginTop: 20,
  },
  message: {
    fontSize: 10,
    color: 'red',
  },
  btnContainerLogin: {
    marginTop: 20,
    width: '95%',
  },
  password: {
    textAlign: 'center',
    color: '#000',
    fontSize: 16,
  },
  btnLogin: {
    backgroundColor: '#00a680',
  },
  iconRight: {
    color: '#c1c1c1',
  },
  text: {
    textAlign: 'center',
    margin: 20,
    fontWeight: 'bold',
    fontSize: 20,
    color: '#000',
  },
  logo: {
    height: 110,
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
});
