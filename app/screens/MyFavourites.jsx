import {
  View,
  Text,
  FlatList,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { FIREBASE_DB, db } from "../../FireBaseConfig";
import { useIsFocused } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import BookItem from "./BookItem";

const MyFavourites = ({ navigation, route }) => {
  const [favouritedBy, setFavouritedBy] = useState([]);
  const [data, setData] = useState([]);
  const routeIdentifier = route.params.id;
  const useruid = route.params.uid;

  const fetchData = async () => {
    try {
      const collectionRef = collection(FIREBASE_DB, "books");
      const snapshot = await getDocs(collectionRef);
      const fetchedData = [];
      const favsArray = [];
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

  if (favouritedBy.length !== 0) {
    console.log(favouritedBy, "favouriteBY");
  }

  return (
    <ScrollView>
      {favouritedBy.map((item) => {
        return <BookItem removeFav={removeFav} item={item} />;
      })}
    </ScrollView>
  );
};

export default MyFavourites;
