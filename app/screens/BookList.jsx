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
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import React, { useEffect, useState } from "react";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../FireBaseConfig";
import { addDoc, collection, doc, getDocs } from "firebase/firestore";
import { useIsFocused } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";

const BookList = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [input, setInput] = useState("");
  const [currUser, setCurrUser] = useState(FIREBASE_AUTH.currentUser);

  const isFocused = useIsFocused();

  const fetchDataFromFirestore = async () => {
    try {
      const collectionRef = collection(FIREBASE_DB, "books");
      const snapshot = await getDocs(collectionRef);
      const fetchedData = [];
      snapshot.forEach((doc) => {
        fetchedData.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchDataFromFirestore();
    }
  }, []);

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
                  uid: item.userID,
                })
              }
            >
              <View style={styles.bookContainer}>
                <Text style={styles.bookName}>{item.bookTitle}</Text>
                <View style={styles.contentContainer}>
                  <View style={styles.textContainer}>
                    <View style={styles.dataContainer}>
                      <Text style={styles.textDescription}>Author:</Text>
                      <Text style={styles.text}>{item.bookAuthor}</Text>
                    </View>

                    <View style={styles.dataContainer}>
                      <Text style={styles.textDescription}>Genre: </Text>
                      <Text style={styles.text}>{item.genre}</Text>
                    </View>

                    <View style={styles.dataContainer}>
                      <Text style={styles.textDescription}>Condition: </Text>
                      <Text style={styles.text}>{item.bookCondition}</Text>
                    </View>
                  </View>

                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.bookImage}
                    ></Image>
                  </View>
                </View>
              </View>
            </Pressable>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  };

  return (
    <View style={styles.pageContainer}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  pageContainer: {
    backgroundColor: "#00592e",
    height: "100%",
  },
  container: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#00592e",
  },
  searchFilterContainer: {
    height: "85%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  searchBarContainer: {
    marginTop: 45,
    marginBottom: 30,
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
    marginBottom: 35,
    width: "92%",
    height: 180,
    borderColor: "white",
    backgroundColor: "white",
    borderRadius: 20,
    marginLeft: 15,
  },
  bookName: {
    fontSize: 15,
    textAlign: "center",
    fontWeight: "bold",
    color: "black",
    marginTop: 12,
  },
  contentContainer: {
    display: "flex",
    flexDirection: "row",
    height: "90%",
  },
  imageContainer: {
    width: "45%",
    height: "90%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  bookImage: {
    height: "70%",
    width: "50%",
    borderRadius: 5,
    marginLeft: 30,
  },
  textContainer: {
    width: "50%",
    height: "90%",
    display: "flex",
    justifyContent: "center",
    marginTop: -15,
  },

  dataContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "container",
    alignItems: "center",
    marginLeft: 10,
    marginRight: 10,
  },
  textDescription: {
    marginTop: 15,
    paddingLeft: 5,
    paddingRight: 5,
    fontWeight: "bold",
    fontSize: 12,
  },

  text: {
    marginTop: 15,
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 12,
  },
});

export default BookList;
