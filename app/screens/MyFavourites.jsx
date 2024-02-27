import { View, Text, FlatList, ScrollView, StyleSheet, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../../FireBaseConfig";
import { useIsFocused } from "@react-navigation/native";

const MyFavourites = ({navigation, route}) => {
  // const [data, setData ] = useState([])
  const [favouritedBy, setFavouritedBy] = useState([])
  // console.log('test')
  // console.log(route.params.uid)
  // const currentUser = route.params.uid
  // const isFocused = useIsFocused()


  const [data, setData] = useState([]);
  console.log(route, 'ROUTE LOG')
  const routeIdentifier = route.params.id;
  const useruid = route.params.uid;

  console.log(useruid)


  // const fetchDataFromFirestore = async () => {
  //   try {
  //     const collectionRef = collection(FIREBASE_DB, "books");
  //     const snapshot = await getDocs(collectionRef);
  //     const fetchedData = [];
  //     snapshot.forEach((doc) => {
  //       console.log(doc.data(), '<< doc data')
  //       fetchedData.push({
  //         id: doc.id,
  //         ...doc.data(),
  //       });
  //     });

  //     setData(fetchedData);
  //   } catch (error) {
  //     console.error("Error fetching data: ", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchDataFromFirestore();
  // }, []);

  
  

  // if (data.length !== 0) {
  //   const favouritesArray = []
    
  //   for (let i = 0; i < data.length; i++) {
  //     console.log(data[i].favouritedBy)
  //     if (data[i].favouritedBy) {
  //      for (let j = 0; j < data[i].favouritedBy.length; j++) {
  //       console.log(data[i].favouritedBy[j], '<<<<!!')
  //       if (data[i].favouritedBy[j] === useruid) {
  //           favouritesArray.push(data[i])
  //       }
  //      }
  //     }
  //   }
  //   console.log(favouritesArray)
  //   setFavouritedBy(favouritesArray)
  // }

  useEffect(() => {
  const fetchData = async () => {
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

  fetchData(); // Fetch data when component mounts

}, []); // Empty dependency array






      


  return (
   <ScrollView>
    {/* {data.map((book) => {
      if (book.bookTitle === 'Six Thinking Hats') {
        return (
          <Text>{book.bookTitle}</Text>
        )

      }
    })} */}
    <View style={styles.container}>
        {favouritedBy.map((item) => (
          <View key={item.id} style={styles.bookContainer}>
            <Image source={{ uri: item.image }} style={styles.bookImage} />
            <Text style={styles.bookText}>Title: {item.bookTitle}</Text>
            <Text style={styles.bookText}>Author: {item.bookAuthor}</Text>
            <Text style={styles.bookText}>Condition: {item.bookCondition}</Text>
            <Text style={styles.bookText}>Rating: {item.bookRating}</Text>
            <Text style={styles.bookText}>Preview: {item.bookPreview}</Text>
          </View>
        ))}
      </View>

   </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00592e",
  },
  bookContainer: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    padding: 20,
    marginVertical: 10,
    width: '90%', 
    alignSelf: 'center', 
    backgroundColor: 'green', 
    justifyContent: 'center',
    alignItems: 'center'
  },
  bookImage: { 
    width: 100, 
    height: 150,
    resizeMode: 'contain'
  },
  bookText: {
    textAlign: 'center',
    color: 'white',
    marginBottom: 10,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default MyFavourites;
