import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
import { Camera } from "expo-camera";
import { serverTimestamp } from 'firebase/firestore';
import { getBookByISBN } from '../../api/books';

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

export default function BarCodeScan() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);
  const [bookDetails, setBookDetails] = useState<BookItem | null>(null);

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
      const newBookData = addBook(bookData.items[0]);
      setBookDetails(newBookData);
    } else {
      console.log('No data found for ISBN:', data);
    }
  };

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
            {/* <img src={bookDetails.volumeInfo.imageLinks.thumbnail} /> */}
            <Text>Book ID: {bookDetails.id}</Text>
            <Text>Title: {bookDetails.volumeInfo.title}</Text>
          </View>
        )}
      </View>
      {scanned && (
        <View style={styles.buttonContainer}>
          <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
        </View>
      )}
    </View>
  );
}

const addBook = (book: any): BookItem => {
  const newBook: BookItem = {
    id: book.id,
    volumeInfo: book.volumeInfo,
    accessInfo: {
      webReaderLink: book.accessInfo?.webReaderLink,
    },
    searchInfo: {
      textSnippet: book.searchInfo?.textSnippet,
    },
  };
  return newBook;
};

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