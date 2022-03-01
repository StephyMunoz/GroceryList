import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-easy-toast';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Divider, Icon} from 'react-native-elements';
import {db} from '../../firebase';
import {useAuth} from '../../lib/auth';
import Loading from '../../components/Loading';

const screenHeight = Dimensions.get('window').height;

const GroceryList = () => {
  const navigation = useNavigation();
  const toastRef = useRef();
  const {user} = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [groceryList, setGroceryList] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let listItem = [];
      db.ref(`groceryList/${user.uid}`).on('value', snapshot => {
        snapshot.forEach(item => {
          console.log('wh', item);
          const q = item.val();
          listItem.push(q);
        });
      });
      setGroceryList(listItem);
    }, [user.uid]),
  );

  return (
    <View style={styles.viewBody}>
      {groceryList.length === 0 ? (
        <Text style={styles.textEmpty}>
          Parece que aún no tienes una lista de compras creada
        </Text>
      ) : (
        <FlatList
          data={groceryList}
          renderItem={listItem => (
            <List
              navigation={navigation}
              toastRef={toastRef}
              listItem={listItem}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
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

function List({listItem, navigation, toastRef}) {
  const {id, title, products} = listItem.item;
  // console.log('djd', groceryList[0].id);
  // console.log('grocery', groceryList);
  console.log('title', title);
  console.log('prod', products);
  // console.log('products', groceryList.products);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(null);

  const handleNavigation = () => {
    navigation.navigate('list_detail', {id, title, products});
  };

  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigation}>
          <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
        <Icon
          name="pencil"
          type="material-community"
          size={30}
          containerStyle={styles.iconEdit}
          // onPress={handleEdit}
        />
        <Icon
          name="delete"
          type="material-community"
          size={30}
          containerStyle={styles.iconTrash}
          // onPress={handleDelete}
        />
        <Divider style={styles.divider} width={1} />
      </View>
      <Loading isVisible={isLoading} text={loadingText} />
    </View>
  );
}

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
  title: {
    marginLeft: 50,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 20,
  },
  iconEdit: {
    position: 'absolute',
    right: 50,
    top: 10,
  },
  iconTrash: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
});
