import {
  View,
  Text,
  StyleSheet,
  Button,
  FlatList,
  ImageBackground,
  Pressable,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import React, { useEffect, useState } from "react";
import { FIREBASE_DB } from "../../FireBaseConfig";
import { addDoc, collection, doc, getDocs } from "firebase/firestore";
import { useIsFocused } from "@react-navigation/native";



const BookList = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [input, setInput] = useState("");
  const isFocused = useIsFocused()

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
        console.log(doc, "doc");
      });
      console.log(fetchedData)
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
  if (isFocused) {
    console.log('book list focused')
    fetchDataFromFirestore();
  }
}, []);

console.log(data[0])

  const SearchFilter = ({ data, input }) => {
    return (
      <View style={styles.searchFilterContainer}>
        <FlatList
          data={data.filter(
            (item) =>
              input === "" ||
              item.bookTitle.toLowerCase().includes(input.toLowerCase())
          )}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                navigation.navigate("SingleBookPage", {
                  id: item.id,
                  uid: item.userID
                })
              }
            >
              <ImageBackground
                source={require("../../Images/blank_vintage_book_by_vixen525_d600pp8-fullview.png")}
                style={styles.bookContainer}
              >
                <View style={styles.contentContainer}>
                  <View style={styles.textAndImageContainer}>
                    <View style={styles.textContainer}>
                    <Text style={styles.text}>Title: {item.bookTitle}</Text>
                    <Text style={styles.text}>Author: {item.bookAuthor}</Text>
                    <Text style={styles.text}>Genre: {item.genre}</Text>
                    </View>
                    
                    <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.bookImage}
                    ></Image>
                    </View>


                  </View>
                  <View style={styles.synopsisContainer}>
                  <Text style={styles.synopsisHeading}>
                      Synopsis:
                    </Text>
                    <Text style={styles.synopsisText}>
                      {item.bookPreview}
                    </Text>
                  </View>
                </View>
              </ImageBackground>
            </Pressable>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  };


  return (
      <SafeAreaView style={styles.container}>
        <View style={styles.searchBarContainer}>
          <Icon name="search" size={20} style={styles.searchIcon} />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#fff"
            style={styles.searchBar}
            value={input}
            onChangeText={(text) => setInput(text)}
          ></TextInput>
        </View>
        <SearchFilter data={data} input={input} setInput={setInput} />
      </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: '#00592e',

  },
  searchBarContainer: {
    marginTop: 200,
    marginBottom: 50,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#ccc",
    borderRadius: 5,
    width: "80%",
  },
  searchBar: {
    backgroundColor: "transparent",
    flex: 1,
    fontSize: 20,
    color: "white",
    height: 40,
    paddingLeft: 35,
    fontWeight: "bold",
  },
  searchIcon: {
    color: "#fff",
    marginLeft: 10,
    marginRight: -30,

  },
  bookContainer: {
    margin: 5,
    width: 320,
    height: 280,
  },
  contentContainer: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
  },
  textAndImageContainer: {
    width: "50%",
    height: "90%",
    display: "flex",
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  textContainer: {
    width: "100%",
    height: "50%",
  },
  text: {
    marginTop: 15,
    marginLeft: 5,
    fontSize: 10,
    paddingLeft: 5,
    paddingRight: 5,
  },
  synopsisContainer: {
    width: "50%",
    marginTop: 10,
  },
  synopsisHeading: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  synopsisText: {
    marginTop: 15,
    marginLeft: 5,
    fontSize: 5,
    paddingLeft: 8,
    paddingRight: 8,
    textAlign: "justify",
  },
  imageContainer: {
    width: "50%",
    height: "40%",
    textAlign: "center",
    marginTop: 16,
  },
  bookImage: {
    height: "100%",
    width: "100%",
    borderRadius: 5,
  },
});

export default BookList;

