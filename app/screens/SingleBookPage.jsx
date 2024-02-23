import { View, Text, StyleSheet, Button, ScrollView, Image, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { FIREBASE_DB } from "../../FireBaseConfig";
import { collection, getDocs } from "firebase/firestore";

const SingleBookPage = ({ navigation, route }) => {
  const [data, setData] = useState([]);
  const routeIdentifier = route.params.id;
  // const bookTitle = route.params.bookTitle;
  console.log(route.params.bookTitle, "BOOK TITLE SINGLE BOOK PAGE");

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
    fetchDataFromFirestore();
  }, []);

  console.log(data[0]);

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.routeContainer}>
        <Text style={styles.route}>{routeIdentifier}</Text>
      </View>

      {data.map((loc) => {
        if (loc.bookTitle === undefined) {
          loc.bookTitle = "no information available";
        }

        if (loc.bookAuthor === undefined) {
          loc.bookAuthor = "no information available";
        }

        if (loc.bookPreview === undefined) {
          loc.bookDesc = "no information available";
        }

        if (loc.bookCondition === undefined) {
          loc.bookCondition = "no information available";
        }

        if (loc.bookRating === undefined) {
          loc.bookRating = "no information available";
        }

        if (loc.genre === undefined) {
          loc.genre = "no information available";
        }

        if (loc.user === undefined) {
          loc.user = "no information available";
        }

        if (loc.id === routeIdentifier) {
          return (
            <View style={styles.pageContainer}>
              <View style={styles.headingContainer}>
                <Text style={styles.heading}>{loc.bookTitle}</Text>
              </View>

              <View style={styles.titleContainer}>
                <Text style={styles.titleInfo}>Title: {loc.bookTitle}</Text>
              </View>

              <View style={styles.bookAuthorContainer}>
                <Text style={styles.authorInfo}>Author: {loc.bookAuthor}</Text>
              </View>

              <View style={styles.bookConditionContainer}>
                <Text style={styles.bookConditionInfo}>
                  Condition: {loc.bookCondition}
                </Text>
              </View>

              <View style={styles.genreContainer}>
                <Text style={styles.genreInfo}>Genre: {loc.genre}</Text>
              </View>

              <View style={styles.bookPreviewContainer}>
                <Text style={styles.bookPreviewInfo}>
                  Synopsis: {loc.bookPreview}
                </Text>
              </View>

              <View style={styles.userContainer}>
                <Text style={styles.userInfo}>User: {loc.user}</Text>
              </View>

              <View style={styles.bookRatingContainer}>
                <Text style={styles.bookRatingInfo}>
                  Rating: {loc.bookRating}
                </Text>
              </View>

              <Button title="Order now" />
            </View>
          );
        }
      })}
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: '#590031',
  },
  headingContainer: {
    borderColor: 'white',
    borderWidth: 2,
    marginTop: 50,
    marginBottom: 30,
    padding: 10,
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },



titleContainer: {
  borderColor: 'white',
  borderWidth: 2,
  marginTop: 50,
  marginBottom: 30,
  padding: 10,
},
titleInfo: {
color: 'white',
fontSize: 20,
textAlign: "center",
},



});

export default SingleBookPage;
