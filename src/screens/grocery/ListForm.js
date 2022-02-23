import React, {useEffect, useRef, useState} from 'react';
import {Text, View} from 'react-native';
import {db} from '../../firebase';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../../lib/auth';

const ListForm = () => {
  const navigation = useNavigation();
  const toastRef = useRef();
  const {user} = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let items = [];
    db.ref('products').on('value', snapshot => {
      snapshot.forEach(item => {
        console.log('item', item);
        const q = item.val();
        items.push(q);
      });
    });
    setProducts(items);
  }, []);

  console.log('prod', products);

  return (
    <View>
      <Text>Hola productos</Text>
    </View>
  );
};

export default ListForm;
