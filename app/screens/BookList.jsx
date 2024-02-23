import { View, Text, StyleSheet, Button, FlatList, ImageBackground, Pressable, TextInput, TouchableOpacity} from 'react-native';
import React, { useEffect, useState } from 'react';
import { FIREBASE_DB } from '../../FireBaseConfig';
import { addDoc, collection, getDocs } from 'firebase/firestore';


const BookList = ({navigation}) => {
  const [data, setData] = useState([]);
  const [searchBook, setSearchBook] = useState([]); 

console.log(data[0].bookTitle)

const searchBookTerm = () => {
  data.forEach((book) => {
    if (book.bookTitle.toLowerCase().includes(searchBook.toLowerCase())) {
      setSearchBook(book.bookTitle);
    }
  })

return 'Hello'
}


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

    <TextInput
    placeholder="Search"
    style={styles.searchBar}
    value={searchBook}
    onChangeText={(bookName) => setSearchBook(bookName)}
    >
    </TextInput>

    <View>
    <TouchableOpacity>
      <Text>Submit here</Text>
    </TouchableOpacity>
</View>


      <FlatList
        data={data}
        renderItem={({item}) => (
          <Pressable onPress={() => navigation.navigate('SingleBookPage', {
            title: item.bookTitle
          })}>

          <ImageBackground source={require('../../Images/blank_vintage_book_by_vixen525_d600pp8-fullview.png')}
            style={styles.bookContainer}>
            <Text style={styles.text}>{item.bookTitle}</Text>
            <Text>{item.bookAuthor}</Text>
            <Text>{item.bookDesc}</Text>
            <Text>{item.uploadedBy}</Text>
          
          </ImageBackground>

          </Pressable>
        )}
        keyExtractor={item => item.id}
      />
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: 'red', 
  },

  bookContainer: {

    margin: 5,
    width: 200,
    height: 200,
    
  
  },
  text: {
    margin: 5,
  }, 


  searchBar: {
    marginTop: 50,
    marginBottom: 50,
    backgroundColor: 'white',
    borderColor: 'green',
    borderWidth: 2,
    borderRadius: 10,
    height: 40,
    width: 200,
    alignContent: "center",
  }
});

export default BookList;
