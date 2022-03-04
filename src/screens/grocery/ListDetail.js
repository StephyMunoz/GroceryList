import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {CheckBox, Divider} from 'react-native-elements';
import Toast from 'react-native-easy-toast';
import {useAuth} from '../../lib/auth';

const ListDetail = props => {
  const {navigation, route} = props;
  const toastRef = useRef();
  const {id, title, products} = route.params;
  const [refreshing, setRefreshing] = useState(false);
  console.log('qe ', products);

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

function ProductList({product}) {
  const {name, imgUrl} = product.item;
  const [isSelected, setSelection] = useState(false);

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.title}>{name}</Text>
        <Image source={{uri: imgUrl}} style={styles.productImage} />
        <Divider style={styles.divider} width={1} />
        <CheckBox
          right
          checked={isSelected}
          onPress={() => setSelection(!isSelected)}
          containerStyle={styles.checkbox}
          checkedColor="#a061a8"
          color="#a061a8"
        />
      </View>
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
  iconTrash: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  checkbox: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  productImage: {
    height: 150,
    width: 150,
    alignContent: 'center',
  },
  title: {
    fontSize: 20,
    marginTop: 20,
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  form: {
    flexDirection: 'row',
  },
  actionText: {
    color: '#5da1d8',
    position: 'absolute',
    top: 0,
    right: 0,
  },
  divider: {
    marginTop: 10,
    marginBottom: 20,
  },
  action: {
    flexDirection: 'row',
  },
  inputForm: {
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 10,
    color: '#000',
  },
  btnContainerLogin: {
    width: '20%',
  },
});
