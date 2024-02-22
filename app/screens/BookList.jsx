import { View, Text, StyleSheet, Button, FlatList, ImageBackground} from 'react-native';
import React, { useEffect, useState } from 'react';
import { FIREBASE_DB } from '../../FireBaseConfig';
import { addDoc, collection, getDocs } from 'firebase/firestore';

// const BookList = () => {
//   const test = async () => {
//     console.log('add')

//     const doc = addDoc(collection(FIREBASE_DB, 'todos'), {title: 'I am a test', done: false})
//     console.log(doc, 'done')

//   }

//   return (
//     <View>
//       <Button onPress={test} title='test add'/>
//     </View>
//   )
// }

// export default BookList;

const BookList = () => {
  const [data, setData] = useState([]);

  const fetchDataFromFirestore = async () => {
    try {
      const collectionRef = collection(FIREBASE_DB, 'books');
      const snapshot = await getDocs(collectionRef);
      // console.log(snapshot)
      const fetchedData = [];
      snapshot.forEach((doc) => {
        fetchedData.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      // console.log(fetchedData);
      // console.log(fetchedData[0].coords.latitude);
      setData(fetchedData);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  useEffect(() => {
    fetchDataFromFirestore();
  }, []); // useEffect to fetch data when the component mounts

  return (
    <ImageBackground 
    source={require('../../Images/wp13203104.jpg')}
    style={{flex: 1}} 
  >
    <View style={styles.container}>
      <Text>Test</Text>
      {/* Render your data here */}
      <FlatList
        data={data}
        renderItem={({item}) => (
          <View style={styles.bookContainer}>
            <Text>{item.bookTitle}</Text>
            <Text>{item.bookAuthor}</Text>
            <Text>{item.bookDesc}</Text>
            <Text>{item.uploadedBy}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
      />
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bookContainer: {
    flex: 1,
    borderColor: 'black',
    borderWidth: 1,
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 10,
    width: 300,
  }
});

export default BookList;
