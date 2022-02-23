import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import Toast from 'react-native-easy-toast';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Icon} from 'react-native-elements';
import {db} from '../../firebase';
import {useAuth} from '../../lib/auth';

const screenHeight = Dimensions.get('window').height;

const GroceryList = () => {
  const navigation = useNavigation();
  const toastRef = useRef();
  const {user} = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [groceryList, setGroceryList] = useState([]);

  useEffect(() => {
    let listItem = [];
    db.ref(`groceryList/${user.uid}`).on('value', snapshot => {
      snapshot.forEach(item => {
        const q = item.val();
        listItem.push(q);
      });
    });
    setGroceryList(listItem);
  }, [user.uid]);

  return (
    <View style={styles.viewBody}>
      {groceryList.length === 0 ? (
        <Text style={styles.textEmpty}>
          Parece que aún no tienes una lista de compras creada
        </Text>
      ) : (
        <Text>Hola</Text>
      )}

      <Icon
        reverse
        type="material-community"
        name="plus"
        color="#a061a8"
        containerStyle={styles.btnContainer}
        onPress={() => navigation.navigate('form_add_list')}
      />
      <Toast ref={toastRef} position="center" opacity={0.9} />
    </View>
  );
};

export default GroceryList;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 20,
    marginTop: 20,
  },
  btnContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    shadowColor: 'black',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.5,
  },
  viewBody: {
    flex: 1,
    backgroundColor: '#fff',
  },
  textEmpty: {
    marginTop: screenHeight / 3,
    textAlign: 'center',
    color: '#000',
    fontSize: 20,
  },
});
