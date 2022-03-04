import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import avatarImage from '../../images/character_icons_7.png';
import {Avatar, Button, Icon, ListItem} from 'react-native-elements';
import {useAuth} from '../../lib/auth';
import ChangeDisplayNameForm from '../../components/account/ChangeDisplayNameForm';
import {auth, db} from '../../firebase';
import ChangeEmailForm from '../../components/account/ChangeEmailForm';
import ChangePasswordForm from '../../components/account/ChangePasswordForm';
import Toast from 'react-native-easy-toast';

const ProfileOptions = () => {
  const {user, logout} = useAuth();
  const toastRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const [showModalEmail, setShowModalEmail] = useState(false);
  const [showModalPassword, setShowModalPassword] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [change, setChange] = useState(false);
  // const [loading, setLoading] = useState(false);
  // const [text, setText] = useState(null);

  useEffect(() => {
    (async () => {
      await auth.currentUser;
      await db
        .ref(`users/${user.uid}/displayName`)
        .set(auth.currentUser.displayName);
    })();
    setChange(false);
  }, [change, user]);

  const editName = () => {
    setShowModal(true);
  };
  const editMail = () => {
    setShowModalEmail(true);
  };
  const changePassword = () => {
    setShowModalPassword(true);
  };

  return (
    <ScrollView>
      <View style={styles.viewUserInfo}>
        <Avatar
          rounded
          resizeMode="contain"
          size="xlarge"
          containerStyle={styles.userInfoAvatar}
          source={
            auth.currentUser.photoURL
              ? {uri: auth.currentUser.photoURL}
              : avatarImage
          }
        />
        <View style={styles.textStyle}>
          <Text style={styles.displayName}>
            {auth.currentUser.displayName
              ? auth.currentUser.displayName
              : user.displayName}
          </Text>
          <Text style={styles.emailText}>{auth.currentUser.email}</Text>
          <Button
            title="Cerrar sesión"
            buttonStyle={{backgroundColor: '#a061a8'}}
            onPress={logout}
          />
        </View>
      </View>
      <View>
        <ListItem.Accordion
          content={
            <>
              <Icon name="account-circle" size={40} style={styles.iconStyle} />
              <ListItem.Content>
                <ListItem.Title>Información de la cuenta</ListItem.Title>
              </ListItem.Content>
            </>
          }
          isExpanded={expanded}
          onPress={() => {
            setExpanded(!expanded);
          }}>
          <ListItem key={1} onPress={editName} bottomDivider topDivider>
            <ListItem.Content>
              <View>
                <ListItem.Title>
                  {auth.currentUser.displayName
                    ? auth.currentUser.displayName
                    : user.displayName}
                </ListItem.Title>
                <ListItem.Subtitle>
                  <Text>Nombre de usuario</Text>
                </ListItem.Subtitle>
              </View>
            </ListItem.Content>
            <Icon name="edit" type="material-icons" />
            <ChangeDisplayNameForm
              isVisible={showModal}
              setIsVisible={setShowModal}
            />
          </ListItem>

          <ListItem key={2} onPress={editMail} bottomDivider topDivider>
            <ListItem.Content>
              <View>
                <ListItem.Title>{auth.currentUser.email}</ListItem.Title>
                <ListItem.Subtitle>
                  <Text>Email registrado</Text>
                </ListItem.Subtitle>
              </View>
            </ListItem.Content>
            <Icon name="edit" type="material-icons" />
            <ChangeEmailForm
              isVisible={showModalEmail}
              setIsVisible={setShowModalEmail}
            />
          </ListItem>

          <ListItem key={3} onPress={changePassword} bottomDivider topDivider>
            <ListItem.Content>
              <View>
                <ListItem.Title>Contraseña</ListItem.Title>
                <ListItem.Subtitle>
                  <Text>*********</Text>
                </ListItem.Subtitle>
              </View>
            </ListItem.Content>
            <Icon name="edit" type="material-icons" />
            <ChangePasswordForm
              isVisible={showModalPassword}
              setIsVisible={setShowModalPassword}
            />
          </ListItem>
        </ListItem.Accordion>
        {/*<ChangeDisplayNameForm*/}
        {/*  isVisible={showModal}*/}
        {/*  setIsVisible={setShowModal}*/}
        {/*/>*/}
      </View>
      {/*<Loading isVisible={loading} text={text} />*/}
      <Toast ref={toastRef} position="center" opacity={0.9} />
    </ScrollView>
  );
};

export default ProfileOptions;

const styles = StyleSheet.create({
  viewUserInfo: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    paddingTop: 30,
    paddingBottom: 30,
  },
  textStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfoAvatar: {
    marginRight: 20,
    resizeMode: 'contain',
  },
  displayName: {
    fontWeight: 'bold',
    paddingBottom: 5,
    fontSize: 20,
    color: '#000',
  },
  emailText: {
    paddingBottom: 5,
    fontSize: 15,
    color: '#000',
  },

  viewUserInfoForm: {
    minHeight: '100%',
    backgroundColor: '#f2f2f2',
  },
  iconStyle: {
    paddingRight: 10,
  },
  view: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
  btnContainer: {
    marginTop: 20,
    width: '95%',
  },
  btn: {
    backgroundColor: '#00a680',
  },
});
