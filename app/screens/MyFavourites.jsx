import { ScrollView, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import {
  arrayRemove,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { FIREBASE_DB } from "../../FireBaseConfig";
import BookItem from "./BookItem";

const MyFavourites = ({ route }) => {
  const [favouritedBy, setFavouritedBy] = useState([]);
  const [data, setData] = useState([]);
  const routeIdentifier = route.params.id;
  const useruid = route.params.uid;

  const fetchData = async () => {
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

      if (fetchedData.length !== 0) {
        const favouritesArray = [];
        for (let i = 0; i < fetchedData.length; i++) {
          if (fetchedData[i].favouritedBy) {
            for (let j = 0; j < fetchedData[i].favouritedBy.length; j++) {
              if (fetchedData[i].favouritedBy[j] === useruid) {
                favouritesArray.push(fetchedData[i]);
              }
            }
          }
        }
        setFavouritedBy(favouritesArray);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const removeFav = async (bookId) => {
    const bookRef = doc(FIREBASE_DB, "books", `${bookId}`);

    await updateDoc(bookRef, {
      favouritedBy: arrayRemove(useruid),
    });
    fetchData();
  };

  // if (favouritedBy.length !== 0) {
  //   console.log(favouritedBy, "favouriteBY");
  // }

  return (
    <ScrollView style={styles.container}>
      {favouritedBy.map((item) => {
        return <BookItem key={item.id} removeFav={removeFav} item={item} />;
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00592e",
  },
});

export default MyFavourites;
