import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, Alert } from "react-native";
import { Camera } from "expo-camera";
import { serverTimestamp } from 'firebase/firestore';
import { getBookByISBN } from '../../api/books';
import { title } from "process";
import { useNavigation } from '@react-navigation/native';


type BookItem = {
  id: string;
  volumeInfo: {
    imageLinks: any;
    title?: string;
  };
  accessInfo?: {
    webReaderLink?: string;
  };
  searchInfo?: {
    textSnippet?: string;
  };
};


export default function BarCodeScan({onBookScanned}) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);
  const [bookDetails, setBookDetails] = useState<BookItem | null>(null);
  const [bookTitle, setBookTitle] = useState('')
  const [bookAuthor, setAuthor] = useState('')
  const [bookAverageRating, setAverageRating] = useState('')
  const [bookCategory, setCategory] = useState('')
  const [bookSynopsis, setSynopsis] = useState('')
  const navigation = useNavigation();


  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    const bookData = await getBookByISBN(data);
    if (bookData && bookData.items && bookData.items.length > 0) {
      const newBookData = bookData.items[0];
      const volumeInfo = newBookData.volumeInfo;
      console.log(volumeInfo.imageLinks.thumbnail)
onBookScanned({
      title: volumeInfo?.title || '',
      author:volumeInfo?.authors?.[0] || 'N/A',
      averageRating:volumeInfo?.averageRating?.toString() || 'N/A',
      category: volumeInfo?.categories?.[0] || 'N/A',
      synopsis: volumeInfo?.description || 'N/A',
      image: volumeInfo.imageLinks.thumbnail || 'N/A'
  });
      Alert.alert('Book Successfully Scanned', 'Please Close Scanner.');
    
      } else {
      console.log('No data found for ISBN:', data);
    }
  };
  
  // console.log(bookAuthor, 'Please Work')
  // console.log(bookTitle)
  // console.log(bookAverageRating)
  // console.log(bookSynopsis)
  // console.log(bookCategory)

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <Camera
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.bookInfoContainer}>
        {bookDetails && (
          <View style={styles.bookDetails}>
        
          </View>
        )}
      </View>
      {/* {scanned && (
        <View style={styles.buttonContainer}>
          <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
        </View>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  bookInfoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookDetails: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContainer: {
    marginBottom: 20,
  },
});