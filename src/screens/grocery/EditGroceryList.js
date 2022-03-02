import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../lib/auth';
import {db} from '../../firebase';
import * as yup from 'yup';
import uuid from 'random-uuid-v4';
import {Formik} from 'formik';
import {Icon, Input} from 'react-native-elements';
import Toast from 'react-native-easy-toast';
import Loading from '../../components/Loading';

const EditGroceryList = props => {
  const {id, products, title} = props.route.params;
  const navigation = useNavigation();
  const toastRef = useRef();
  const {user} = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [list, setList] = useState([...products]);

  useEffect(() => {
    let items = [];
    db.ref('products').on('value', snapshot => {
      snapshot.forEach(item => {
        const q = item.val();
        items.push(q);
      });
    });
    setProductList(items);
  }, []);

  useEffect(() => {
    if (productList.length === 0) {
      setRefreshing(true);
      wait(2000).then(() => setRefreshing(false));
    }
  }, [productList.length]);

  const schema = yup.object().shape({
    title: yup.string().required('Ingrese un título para la lista'),
  });

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, [setRefreshing]);

  const onFinish = async data => {
    if (data.title === '') {
      toastRef.current.show('Ingrese un título para su lista de compras');
    } else {
      if (list.length > 0) {
        db.ref(`groceryList/${user.uid}`).on('value', snapshot => {
          snapshot.forEach(itemId => {
            const q = itemId.val();
            if (q.id === id) {
              db.ref(`groceryList/${user.uid}/${itemId.key}`)
                .set({
                  title: data.title,
                  products: list,
                  id: id,
                })
                .then(() => {
                  toastRef.current.show('Lista actualizada');
                  navigation.navigate('grocery_list');
                })
                .catch(() => {
                  toastRef.current.show(
                    'Debe seleccionar al menos un producto para su lista de compras',
                  );
                });
            }
          });
        });
      } else {
        toastRef.current.show(
          'Debe seleccionar al menos un producto para su lista de compras',
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Formik
          validationSchema={schema}
          initialValues={{
            title: title,
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
      {productList.length > 0 ? (
        <FlatList
          data={productList}
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
              setRefresh={setRefreshing}
              list={list}
              setList={setList}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
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
  const {imgUrl, name, price, id} = product.item;
  const {index} = product.index;
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(null);

  const handleAddProduct = () => {
    if (!list.includes(product.item)) {
      setList([...list, product.item]);
    }
  };

  const handleDeleteProduct = idItem => {
    const num = idItem - 1;
    setList(prevState => {
      return prevState.filter((list, i) => i !== num);
    });
  };

  // console.log('listass que hay', list);

  return (
    <View>
      <View style={styles.container}>
        {/*{list.forEach(item => {*/}
        {/*  if (item.name === name) {*/}
        {/*    console.log('hii', item.name);*/}
        {/*    return (*/}
        {/*      <TouchableOpacity onPress={() => handleDeleteProduct(id)}>*/}
        {/*        <Text style={styles.actionText}>Eliminar</Text>*/}
        {/*      </TouchableOpacity>*/}
        {/*    );*/}
        {/*  } else {*/}
        {/*    console.log('no', item.name);*/}
        {/*    return (*/}
        {/*      <TouchableOpacity onPress={handleAddProduct}>*/}
        {/*        <Text style={styles.actionText}>Agregar</Text>*/}
        {/*      </TouchableOpacity>*/}
        {/*    );*/}
        {/*  }*/}
        {/*})}*/}

        {/*{list.indexOf(product.item) && console.log('hii no', name)}*/}
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

export default EditGroceryList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  textStyle: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 20,
    marginTop: 20,
  },
  product: {
    height: 150,
    width: 150,
    marginBottom: 20,
  },
  viewBody: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    marginTop: 20,
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
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
