import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  ImageBackground,
  Pressable,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FIREBASE_DB } from "../../FireBaseConfig";
import { addDoc, collection, getDocs } from "firebase/firestore";

const BookList = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [fullData, setFullData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

  const fetchDataFromFirestore = async () => {
    try {
      const collectionRef = collection(FIREBASE_DB, "books");
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
      setFullData(fetchedData)
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchDataFromFirestore();
  }, []); // useEffect to fetch data when the component mounts

  const handleSearch = (query) => {
    if (query) {

      console.log(query)
      console.log(data.bookTitle, 'data')
      setSearchQuery(query)
      const formattedQuery = query.toLowerCase()
  
      let filteredData = fullData.filter((book) => {
        return book.bookTitle.toLowerCase().includes(formattedQuery)
      })
      console.log(filteredData)
  
      setData(filteredData)
    }
    else {
      setData(fullData)
    }
  }

  return (
    <ImageBackground
      source={require("../../Images/wp13203104.jpg")}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <TextInput
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            margin: 10,
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            backgroundColor: 'white',
            width: 300
          }}
          placeholder="Search"
          clearButtonMode="always"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={((query) => handleSearch(query))}
        />
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                navigation.navigate("SingleBookPage", {
                  title: item.bookTitle,
                })
              }
            >
              <ImageBackground
                source={require("../../Images/blank_vintage_book_by_vixen525_d600pp8-fullview.png")}
                style={styles.bookContainer}
              >
                <Text style={styles.text}>{item.bookTitle}</Text>
                <Text>{item.bookAuthor}</Text>
                <Text>{item.bookDesc}</Text>
                <Text>{item.uploadedBy}</Text>
              </ImageBackground>
            </Pressable>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  bookContainer: {
    margin: 5,
    width: 200,
    height: 200,
  },
  text: {
    margin: 5,
  },
});

export default BookList;
