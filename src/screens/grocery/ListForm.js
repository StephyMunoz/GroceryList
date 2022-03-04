import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {db} from '../../firebase';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-easy-toast';
import {useAuth} from '../../lib/auth';
import * as yup from 'yup';
import {Formik} from 'formik';
import uuid from 'random-uuid-v4';
import {Icon, Input} from 'react-native-elements';

const ListForm = () => {
  const navigation = useNavigation();
  const toastRef = useRef();
  const {user} = useAuth();
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
  };

  return (
    <View style={styles.container}>
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
              {!isValid &&
                toastRef.current.show('Ingrese un título para la lista')}
            </>
          )}
        </Formik>
      </View>
      {products.length > 0 ? (
        <View>
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
          />
        </View>
      ) : (
        <View>
          <ActivityIndicator />
        </View>
      )}
      <Toast ref={toastRef} position="center" opacity={0.9} />
    </View>
  );
};

function IndividualProduct({product, list, setList}) {
  const {id, imgUrl, name} = product.item;

  const handleAddProduct = () => {
    if (!list.includes(product.item)) {
      setList([...list, product.item]);
    }
  };

  const handleDeleteProduct = idItem => {
    let num = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === idItem) {
        num = i;
      }
    }
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
        <Text style={styles.title} adjustsFontSizeToFit>
          {name}
        </Text>
        <View style={styles.images}>
          <Image source={{uri: imgUrl}} style={styles.product} />
        </View>
      </View>
    </View>
  );
}

export default ListForm;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
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
    marginRight: 20,
    fontWeight: 'bold',
    justifyContent: 'center',
    textAlignVertical: 'auto',
  },
  form: {
    flexDirection: 'row',
  },
  actionText: {
    color: '#5da1d8',
    position: 'absolute',
    top: 10,
    right: 20,
  },
  divider: {
    marginTop: 10,
    marginBottom: 20,
  },
  action: {
    flexDirection: 'row',
  },
  columns: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
    flex: 0.5,
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
