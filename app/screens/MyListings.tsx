import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../FireBaseConfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

const MyListings = (route) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  const fetchDataFromFirestore = async () => {
    try {
      const collectionRef = collection(FIREBASE_DB, "books");
      const snapshot = await getDocs(collectionRef);
      const fetchedData = snapshot.docs
        .filter((doc) => FIREBASE_AUTH.currentUser?.email === doc.data().user)
        .map((doc) => ({
          id: doc.id,
          title: doc.data().bookTitle,
          Author: doc.data().bookAuthor,
          Condition: doc.data().bookCondition,
          Preview: doc.data().bookPreview,
          bookRating: doc.data().bookRating,
          image: doc.data().image,
        }));
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setError("Error fetching data");
    }
  };

  useEffect(() => {
    fetchDataFromFirestore();
  }, []);

  const deleteBook = async (bookId) => {
    try {
      const bookRef = doc(FIREBASE_DB, "books", bookId);
      await deleteDoc(bookRef);
      fetchDataFromFirestore();
    } catch (error) {
      console.error("Error deleting book: ", error);
      setError("Error deleting book");
    }
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error: {error}</Text>
      </View>
    );
  }
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        {data.map((item) => (
          <View key={item.id} style={styles.bookContainer}>
            <Image source={{ uri: item.image }} style={styles.bookImage} />
            <Text style={styles.bookText}>Title: {item.title}</Text>
            <Text style={styles.bookText}>Author: {item.Author}</Text>
            <Text style={styles.bookText}>Condition: {item.Condition}</Text>
            <Text style={styles.bookText}>Rating: {item.bookRating}</Text>
            <Text style={styles.bookText}>Preview: {item.Preview}</Text>
            <Text
              style={styles.deleteButton}
              onPress={() => deleteBook(item.id)}
            >
              Delete
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00592e",
  },
  bookContainer: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    padding: 20,
    marginVertical: 10,
    width: "90%",
    alignSelf: "center",
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
  },
  bookImage: {
    width: 100,
    height: 150,
    resizeMode: "contain",
  },
  deleteButton: {
    backgroundColor: "red",
    color: "white",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  bookText: {
    textAlign: "center",
    color: "white",
    marginBottom: 10,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MyListings;
