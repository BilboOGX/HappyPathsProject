import { View, Text, FlatList, ScrollView, StyleSheet, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { arrayRemove, arrayUnion, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { FIREBASE_DB, db } from "../../FireBaseConfig";
import { useIsFocused } from "@react-navigation/native";
import { AntDesign } from '@expo/vector-icons';
import BookItemTest from "./BookItemTest";


const MyFavourites = ({navigation, route}) => {
  // const [data, setData ] = useState([])
  const [favouritedBy, setFavouritedBy] = useState([])
  // const [readMore, setReadMore] = useState(false)
  // console.log('test')
  // console.log(route.params.uid)
  // const currentUser = route.params.uid
  // const isFocused = useIsFocused()


  const [data, setData] = useState([]);
  console.log(route, 'ROUTE LOG')
  const routeIdentifier = route.params.id;
  const useruid = route.params.uid;

  console.log(useruid, 'USERUID')

  

  console.log(useruid)

  const fetchData = async () => {
    try {
      const collectionRef = collection(FIREBASE_DB, "books");
      const snapshot = await getDocs(collectionRef);
      const fetchedData = [];
      const favsArray = []
      snapshot.forEach((doc) => {
        console.log(doc.data(), '<< doc data')
        fetchedData.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      // setData(fetchedData);

      // Filter and update favouritedBy inside the useEffect
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


  fetchData(); // Fetch data when component mounts

}, []); // Empty dependency array

const removeFav = async (bookId) => {
  console.log(bookId)

  // fetchDataFromFirestore()

  const bookRef = doc(FIREBASE_DB, "books", `${bookId}`)

  await updateDoc(bookRef, {
    favouritedBy: arrayRemove(useruid)
  })

  fetchData()

 


  // setFavouritedBy((prevState) => {
  //   let oldState = [...favouritedBy]

  //   console.log(oldState)
  // })
}





if (favouritedBy.length !== 0) {
  console.log(favouritedBy, 'favouriteBY')
//   favouritedBy.map((book) => {
//     return (
//       <View>

//         <Text>{book.bookCondition}</Text>
//       </View>
//     )
//   })
}

      


  return (
    
   <ScrollView style={styles.container}>
    
    {favouritedBy.map((item) => {
      return (
        <BookItemTest removeFav={removeFav} item={item}/>
      )
    })}
   </ScrollView>
  )
}

const styles = StyleSheet.create({
 container: {
      flex: 1,
      backgroundColor: "#00592e",
    },
})


export default MyFavourites;

