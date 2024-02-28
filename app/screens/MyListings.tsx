import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../FireBaseConfig";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";

const MyListings = (route) => {
  const [data, setData] = useState([]);

  const [error, setError] = useState("");
  const [readMore, setReadMore] = useState(false);

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
            <Text style={styles.bookTitle}>{item.title}</Text>
            <Image source={{ uri: item.image }} style={styles.bookImage} />
            <View style={styles.bookInfo}>
     
              <Text style={styles.bookAuthor}>By {item.Author}</Text>
      
              <View style={styles.conditionAndRating}>
                <View>
                  <Text style={styles.bookConditionRating}>Condition:</Text>
                  <Text style={styles.bookConditionRating}>
                    {item.Condition}
                  </Text>
                </View>

                <View>
                  <Text style={styles.bookConditionRating}>Rating:</Text>
                  <Text style={styles.bookConditionRating}>
                    {item.bookRating}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={styles.bookSynopsisHeading}>Synopsis:</Text>

            {readMore ? (
              <Text style={styles.bookText}>
                {" "}
                {item.Preview}{" "}
                <Text
                  onPress={() => setReadMore(!readMore)}
                  style={{ color: "blue" }}
                >
                  show less...
                </Text>
              </Text>
            ) : (
              <Text style={styles.bookText}>
                {" "}
                {item.Preview.slice(0, 110)}...
                <Text
                  onPress={() => setReadMore(!readMore)}
                  style={{ color: "blue" }}
                >
                  show more...
                </Text>
              </Text>
            )}
            <TouchableOpacity
              onPress={() => deleteBook(item.id)}
              style={styles.deleteButton}
            >
              <Text style={{ color: "white", textAlign: 'center' }}>Delete</Text>
            </TouchableOpacity>
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
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    color: "white",
    padding: 10,
    borderRadius: 30,
    marginTop: 30,
    width: "25%",
  },
  bookTitle: {
    fontSize: 25,
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
  },
  bookInfo: {
    marginTop: 10,
    marginBottom: 20,
  },
  bookConditionRating: {
    textAlign: "center",
    color: "white",
    marginBottom: 5,
    marginRight: 80,
    marginLeft: 80,
  },
  bookSynopsisHeading: {
    color: "white",
    fontWeight: "bold",
    marginBottom: 8,
    fontSize: 18,
  },
  bookText: {
    fontSize: 15,
    textAlign: "justify",
  }, 
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bookAuthor: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  conditionAndRating: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default MyListings;
