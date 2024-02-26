import { View, Text, StyleSheet, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { FIREBASE_DB } from "../../FireBaseConfig";
import { collection, getDocs } from "firebase/firestore";

const SingleBookPage = ({ navigation, route }) => {
  const [data, setData] = useState([]);
  console.log(data, "data in single book page");
  const routeIdentifier = route.params.id;
  const useruid = route.params.userID;
  console.log(useruid, "<<USERID IN SBP");
  console.log(route.params.title, "<<<BOOK TITLE SINGLE BOOK PAGE");

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

  return (
    <View>
      <View style={styles.container}>
        <Text style={styles.heading}>{routeIdentifier}</Text>
        {/* <Text
          data={data}
          renderItem={({ item }) => (
            <Button
              title="Chat now"
              onPress={navigation.navigate("Chat", {
                name: item.id,
                uid: useruid,
              })}
            />
          )}
        >
          {bookTitle}
        </Text> */}
      </View>
      {data.map((loc) => {
        if (loc.bookTitle === undefined) {
          loc.bookTitle = "no information available";
        }

        if (loc.bookAuthor === undefined) {
          loc.bookAuthor = "no information available";
        }

        if (loc.bookDesc === undefined) {
          loc.bookDesc = "no information available";
        }

        if (loc.bookCondition === undefined) {
          loc.bookCondition = "no information available";
        }

        if (loc.id === routeIdentifier) {
          return (
            <View>
              <Text style={styles.heading}>{loc.bookTitle}</Text>
              <Text style={styles.bookInfo}>Book{loc.bookTitle}</Text>
              <Text style={styles.bookInfo}>Author: {loc.bookAuthor}</Text>
              <Text style={styles.bookInfo}>
                Condition: {loc.bookCondition}
              </Text>
              <Text style={styles.bookInfo}>Synopsis: {loc.bookDesc}</Text>
              <Text style={styles.bookInfo}>User: {loc.user}</Text>
              {/* <Text style={styles.bookInfo}>uid: {loc.uid}</Text> */}
              <Text style={styles.bookInfo}>
                Latitude: (change to are vicinity i.e manchester){" "}
                {loc.coords.latitude}
              </Text>
              <Text style={styles.bookInfo}>
                Longitude: {loc.coords.longitude}
              </Text>

              <Button title="Order now" buttonStyle={styles.orderButton} />
              <Button
                title="Chat now"
                buttonStyle={styles.orderButton}
                onPress={navigation.navigate("Chat", {
                  userID: useruid,
                })}
              />
            </View>
          );
        }
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#252f40",
  },
  heading: {
    marginTop: 50,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "blue",
    textAlign: "center",
  },
  orderButton: {
    color: "red",
    backgroundColor: "red",
    borderWidth: 5,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 50,
  },
});

export default SingleBookPage;
