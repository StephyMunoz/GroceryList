import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  RefreshControl,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Button,
} from 'react-native';
import {db} from '../../firebase';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-easy-toast';
import {useAuth} from '../../lib/auth';
import * as yup from 'yup';
import {Formik} from 'formik';
import uuid from 'random-uuid-v4';
import {Divider} from 'react-native-elements/dist/divider/Divider';
import Loading from '../../components/Loading';
import {Icon, Input} from 'react-native-elements';
// import Carousel from '../../components/Carousel';

const ListForm = () => {
  const navigation = useNavigation();
  const toastRef = useRef();
  const {user} = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [productsList, setProductsList] = useState([]);
  const [list, setList] = useState([]);

  useEffect(() => {
    let items = [];
    db.ref('products').on('value', snapshot => {
      snapshot.forEach(item => {
        const q = item.val();
        items.push(q);
      });
    });
    setProducts(items);
  }, []);

  useEffect(() => {
    if (products.length === 0) {
      setRefreshing(true);
      wait(2000).then(() => setRefreshing(false));
    }
  }, [products.length]);

  // useEffect(() => {
  //   let productItem = [];
  //   let productItem2 = [];
  // setList(...productItem);
  // setList(productsList);
  // productItem.push(productsList);
  // productItem2.push(...productItem, productItem);
  // setProductsList({...list}, productsList);
  // productItem2.push({...productItem, name: productsList.name});
  // setList(productsList);
  // productItem2.push(productsList);
  // productItem.push([...productItem, productItem2]);
  // setProductsList({...productItem}, productsList);

  // productItem.push(...productItem, productsList);
  // setProductsList(...productItem, productItem);

  // console.log('que hay en la lista', productItem);
  // console.log('que hay en la lista desde', productsList);
  // }, [productsList, list]);

  console.log('lista arriba', list);

  // console.log('listasprodwhar', productsList);

  const schema = yup.object().shape({
    title: yup.string().required('Ingrese un título'),
  });

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, [setRefreshing]);

  const onFinish = async data => {
    console.log('data', data);
    if (data.title === '') {
      toastRef.current.show('Ingrese un título para su lista de compras');
    } else {
      console.log('hii');
      if (list.length > 0) {
        db.ref(`groceryList/${user.uid}`)
          .push()
          .set({
            title: data.title,
            products: list,
            id: uuid(),
          })
          .then(() => {
            navigation.navigate('grocery_list');
          });
      } else {
        toastRef.current.show(
          'Debe seleccionar al menos un producto para su lista de compras',
        );
      }
    }
  };

  // if (productsList.length > 0) {
  // console.log('list', list);
  // }

  return (
    <View style={styles.container}>
      <Button
        title="Guardar lista"
        // containerStyle={styles.btnContainerLogin}
        // loading={isLoading}
      />
      <View style={styles.form}>
        <Formik
          validationSchema={schema}
          initialValues={{
            title: '',
          }}
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
                name="title"
                placeholder="Ingresa un título para tu lista"
                placeholderTextColor="black"
                containerStyle={styles.inputForm}
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                value={values.title}
                rightIcon={
                  <Icon
                    type="font-awesome"
                    name="check"
                    color="#5da1d8"
                    size={30}
                    onPress={handleSubmit}
                  />
                }
              />
              {errors.title && (
                <Text style={styles.errorMessage}>{errors.title}</Text>
              )}
              <Button
                onPress={handleSubmit}
                title="Guardar lista h"
                disabled={!isValid}
                containerStyle={styles.btnContainerLogin}
                // loading={isLoading}
              />
            </>
          )}
        </Formik>
        <Button
          title="Guardar lista"
          // containerStyle={styles.btnContainerLogin}
          // loading={isLoading}
        />
      </View>
      {products.length > 0 ? (
        <FlatList
          data={products}
          numColumns={2}
          columnWrapperStyle={styles.columns}
          refreshControl={
            <RefreshControl
              enabled={true}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          renderItem={product => (
            <IndividualProduct
              product={product}
              navigation={navigation}
              toastRef={toastRef}
              setRefresh={setRefreshing()}
              setProductsLists={setProductsList}
              productsList={productsList}
              list={list}
              setList={setList}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          // onEndReachedThreshold={0.5}
          // onEndReached={handleLoadMore}
          // ListFooterComponent={<FooterList isLoading={isLoading} />}
        />
      ) : (
        <View>
          <ActivityIndicator />
        </View>
      )}
      <Toast ref={toastRef} position="center" opacity={0.9} />
    </View>
  );
};

function IndividualProduct({product, navigation, toastRef, list, setList}) {
  const {id, imgUrl, name, price} = product.item;
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(null);

  const handleAddProduct = () => {
    if (!list.includes(product.item)) {
      setList([...list, product.item]);
    }
  };

  const handleDeleteProduct = idItem => {
    console.log('num', idItem);
    const num = idItem - 1;
    console.log('num nuev', num);
    setList(prevState => {
      return prevState.filter((list, i) => i !== num);
    });
  };

  return (
    <View>
      <View style={styles.container}>
        {list.includes(product.item) ? (
          <TouchableOpacity onPress={() => handleDeleteProduct(id)}>
            <Text style={styles.actionText}>Eliminar</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleAddProduct}>
            <Text style={styles.actionText}>Agregar</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{name}</Text>
        <View style={styles.images}>
          <Image source={{uri: imgUrl}} style={styles.product} />
        </View>
        {/*<Divider style={styles.divider} width={1} />*/}
      </View>
      <Loading isVisible={isLoading} text={loadingText} />
    </View>
  );
}

export default ListForm;

const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    // justifyContent: 'space-between',
  },
  product: {
    height: 150,
    width: 150,
    marginBottom: 20,
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
  columns: {
    // borderWidth: 1,
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
