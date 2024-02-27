import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../../FireBaseConfig";
import { useIsFocused } from "@react-navigation/native";

const MyFavourites = ({navigation, route}) => {
  // const [data, setData ] = useState([])
  // const [favouritedBy, setFavouritedBy] = useState([])
  // console.log('test')
  // console.log(route.params.uid)
  // const currentUser = route.params.uid
  // const isFocused = useIsFocused()


  const [data, setData] = useState([]);
  console.log(route, 'ROUTE LOG')
  const routeIdentifier = route.params.id;
  const useruid = route.params.uid;

  console.log(useruid)


  const fetchDataFromFirestore = async () => {
    try {
      const collectionRef = collection(FIREBASE_DB, "books");
      const snapshot = await getDocs(collectionRef);
      const fetchedData = [];
      snapshot.forEach((doc) => {
        console.log(doc.data(), '<< doc data')
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

  if (data.length !== 0) {
    const favouritesArray = []
    
    for (let i = 0; i < data.length; i++) {
      console.log(data[i].favouritedBy)
      if (data[i].favouritedBy) {
       for (let j = 0; j < data[i].favouritedBy.length; j++) {
        console.log(data[i].favouritedBy[j], '!!')
        if (data[i].favouritedBy[j] === useruid) {
            favouritesArray.push(data[i].favouritedBy[j])
        }
       }
      }
    }
  }




      


  return (
   <View>
    {data.map((book) => {
      if (book.bookTitle === 'Six Thinking Hats') {
        return (
          <Text>{book.bookTitle}</Text>
        )

      }
    })}
   </View>
  )
}

export default MyFavourites;
