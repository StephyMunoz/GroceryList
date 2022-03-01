import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  RefreshControl,
  View,
} from 'react-native';
import {Divider, Icon} from 'react-native-elements';
import Loading from '../../components/Loading';
import Toast from 'react-native-easy-toast';
import {db} from '../../firebase';
import {useAuth} from '../../lib/auth';

const ListDetail = props => {
  const {navigation, route} = props;
  const toastRef = useRef();
  const {id, title, products} = route.params;
  const [refreshing, setRefreshing] = useState(false);

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, [setRefreshing]);

  useEffect(() => {
    navigation.setOptions({title: title});
  }, [navigation, title]);

  return (
    <View style={styles.viewBody}>
      {/*<Text style={styles.text}>Productos agregados</Text>*/}
      {products && (
        <FlatList
          data={products}
          refreshControl={
            <RefreshControl
              enabled={true}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          renderItem={product => (
            <ProductList
              navigation={navigation}
              product={product}
              idPublication={id}
              setRefreshing={setRefreshing}
              toastRef={toastRef}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
      <Toast ref={toastRef} position="center" opacity={0.9} />
    </View>
  );
};

function ProductList({
  product,
  navigation,
  idPublication,
  setRefreshing,
  toastRef,
}) {
  const {id, price, name, imgUrl} = product.item;
  const {user} = useAuth();
  console.log('prod', product);
  console.log('id pro', id);
  console.log('id', idPublication);
  // console.log('products', groceryList.products);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(null);
  const [productsItem, setProductsItem] = useState(null);

  const handleDelete = () => {
    let arrayProducts = [];
    // setIsLoading(true);
    // setLoadingText('Eliminando producto');
    db.ref(`groceryList/${user.uid}`).on('value', snapshot => {
      snapshot.forEach(item => {
        const q = item.val();
        if (q.id === idPublication) {
          setProductsItem(q.products);
          // if(q.pr)
          console.log('whart', q.products);
        }
        productsItem.forEach((prod, i) => {
          if (prod.id === id) {
            db.ref(`groceryList/${user.uid}/${item.key}/${i}`)
              .remove()
              .then(() => {
                setIsLoading(false);
                setRefreshing(true);
                toastRef.current.show('Producto eliminado');
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
    });

    return () => {
      db.ref('campaigns').off();
    };
  };

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.title}>{name}</Text>
        <Image source={{uri: imgUrl}} style={styles.productImage} />
        <Divider style={styles.divider} width={1} />
        <Icon
          name="delete"
          type="material-community"
          size={30}
          containerStyle={styles.iconTrash}
          onPress={handleDelete}
        />
      </View>
      <Loading isVisible={isLoading} text={loadingText} />
    </View>
  );
}

export default ListDetail;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 20,
    marginTop: 20,
  },
  text: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#303393',
    marginBottom: 20,
  },
  viewBody: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    color: '#070636',
  },
  iconTrash: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  productImage: {
    height: 150,
    width: 150,
    alignContent: 'center',
  },
});