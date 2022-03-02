import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
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
  const [refreshing, setRefreshing] = useState(false);

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, [setRefreshing]);

  useFocusEffect(
    useCallback(() => {
      let listItem = [];
      db.ref(`groceryList/${user.uid}`).on('value', snapshot => {
        snapshot.forEach(item => {
          const q = item.val();
          listItem.push(q);
          console.log('que productos hay', q.products);
        });
      });
      setGroceryList(listItem.reverse());
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
          refreshControl={
            <RefreshControl
              enabled={true}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          renderItem={listItem => (
            <List
              navigation={navigation}
              toastRef={toastRef}
              listItem={listItem}
              setRefresh={setRefreshing}
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

function List({listItem, navigation, toastRef, setRefresh}) {
  const {id, title, products} = listItem.item;
  const {user} = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(null);

  const handleNavigation = () => {
    navigation.navigate('list_detail', {id, title, products});
  };

  const handleEdit = () => {
    navigation.navigate('edit_list', {id, title, products});
  };

  const handleConfirmDelete = () => {
    Alert.alert(
      'Eliminar lista',
      `¿Estas segur@ que desea eliminar la lista ${title}?`,
      [{text: 'Cancelar'}, {text: 'Eliminar', onPress: handleDelete}],
    );
  };

  const handleDelete = () => {
    setIsLoading(true);
    setLoadingText('Eliminando lista de compras');
    db.ref(`groceryList/${user.uid}`).on('value', snapshot => {
      snapshot.forEach(item => {
        const q = item.val();
        if (q.id === id) {
          db.ref(`groceryList/${user.uid}/${item.key}`)
            .remove()
            .then(() => {
              toastRef.current.show('Lista eliminada correctamente');
              setRefresh(true);
              setIsLoading(false);
            })
            .catch(() => {
              setIsLoading(false);
              toastRef.current.show(
                'Ha ocurrido un error, por favor intente nuevamente más tarde ',
              );
            });
        }
      });
    });
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
          onPress={handleEdit}
        />
        <Icon
          name="delete"
          type="material-community"
          size={30}
          containerStyle={styles.iconTrash}
          onPress={handleConfirmDelete}
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
