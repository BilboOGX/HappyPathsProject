
import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableOpacity, Modal, KeyboardAvoidingView,Platform} from 'react-native';
import { collection, addDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../FireBaseConfig";
import { User, onAuthStateChanged } from "firebase/auth";
import { fetchGeoLocation } from '../../AxiosRequests';
import { SafeAreaView, StatusBar, Dimensions, ScrollView, Image} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SelectDropdown from 'react-native-select-dropdown';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BarCodeScan from '../BarcodeScanner/BarcodeScanner';

export default function BookForm() {
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [seller, setSeller] = useState("");
  const [postcode, setPostcode] = useState("");
  const [isPostcodeValid, setIsPostcodeValid] = useState(true);
  const [bookCondition, setBookCondition] = useState('')
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)
  const [bookPreview, setBookPreview] = useState('')
  const [dropdownKey, setDropdownKey] = useState(0)
  const [bookRating, setBookRating] = useState('')
  const [genre, setGenre] = useState('')
  const [isScannerVisible, setScannerVisible] = useState(false);
  const [favouritedBy, setFavouritedBy] = useState([])
  const [image, setImage] = useState('')

  const handleScannedBook = (bookData) => {
    setBookTitle(bookData.title);
    setBookAuthor(bookData.author);
    setBookRating(bookData.averageRating);
    setGenre(bookData.category);
    setBookPreview(bookData.synopsis);
    setImage(bookData.image);
  };

  const [user, setUser] = useState<User | null>(null);
  const [userID, setUserID] = useState("");
  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user.email);
      setUserID(user.uid);
    });
  }, []);

  function isValidUKPostcode(postcode) {
    const cleanPostcode = postcode.replace(/\s+/g, '');
    const pattern = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
    return pattern.test(cleanPostcode);
  }

  function handleReset() {
    setBookTitle("");
    setBookAuthor("");
    setPostcode("");
    setBookCondition("");
    setBookPreview("");
    setAttemptedSubmit(false);
    setDropdownKey((prevKey) => prevKey + 1);
    setBookRating("");
    setGenre("");
  }

  function handleSubmit() {
    setAttemptedSubmit(true);

    if (!bookTitle.trim() || !bookAuthor.trim() || !postcode.trim()) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return;
    }
    if (!isValidUKPostcode(postcode)) {
      Alert.alert("Invalid Postcode", "Please enter a valid UK postcode.");
      return;
    }
      
    fetchGeoLocation(postcode).then((response) => {
      const latitude = response.data.results[0].geometry.location.lat;
      const longitude = response.data.results[0].geometry.location.lng;
    
      return addDoc(collection(FIREBASE_DB, "books"), {
      bookTitle,
      bookAuthor,
      user,
      userID,
      coords: {latitude, longitude },
      bookCondition,
      bookRating,
      bookPreview,
      genre,
      favouritedBy,
      image

    })
  })
    .then((docRef) => {
      Alert.alert('Book successfully posted!');
      setBookTitle('')
      setBookAuthor('')
      setPostcode('')
      setBookCondition('')
      setBookPreview('')
      setAttemptedSubmit(false)
      setBookRating('')
      setGenre('')
      setDropdownKey(prevKey => prevKey + 1)
    
    })
    .catch((error) => {
      console.error(error);
    });
  };


  return (
    <SafeAreaView>
      {/* <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      > */}
    <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
    <View style={styles.rootContainer}>
      <View>

        <TouchableOpacity onPress={() => setScannerVisible(true)}>
          <MaterialCommunityIcons style={styles.scanIcon} name="qrcode-scan" size={75} color="black"/>
        </TouchableOpacity>
      </View>
      <Text style={styles.iconTextContainer}>Click Above To Scan Your Book and Auto-fill Text Fields</Text>

      <Modal
        animationType="slide"
        transparent={false}
        visible={isScannerVisible}
        onRequestClose={() => setScannerVisible(!isScannerVisible)}>
        <BarCodeScan onBookScanned={handleScannedBook} />
        <Button title="Close Scanner" onPress={() => setScannerVisible(false)} />
      </Modal>
  

      
        <View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Book Title"
              value={bookTitle}
              onChangeText={text => setBookTitle(text)}
              style={[styles.input, attemptedSubmit && !bookTitle.trim() && styles.invalidInput]}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Book Author"
              value={bookAuthor}
              onChangeText={(text) => setBookAuthor(text)}
              style={[ styles.input, attemptedSubmit && !bookAuthor.trim() && styles.invalidInput]}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Average Book Rating"
              value={bookRating}
              onChangeText={(text) => setBookRating(text)}
              style={[styles.input]}
            />
          </View>
          

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Synopsis"
            value={bookPreview}
            onChangeText={(text) => setBookPreview(text)}
            style={[styles.input]}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Genre"
            value={genre}
            onChangeText={(text) => setGenre(text)}
            style={[styles.input]}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Postcode"
            value={postcode}
            onChangeText={(text) => {
              setPostcode(text);
              setIsPostcodeValid(isValidUKPostcode(text));
            }}
            style={[styles.input, attemptedSubmit && styles.invalidInput]}
          />
        </View>

        <SelectDropdown
          key={dropdownKey}
          data={["Excellent", "Very Good", "Good", "Poor"]}
          onSelect={(selectedItem) => {
            setBookCondition(selectedItem);
          }}
          defaultButtonText="Select Book Condition"
          buttonTextAfterSelection={(selectedItem) => {
            return selectedItem;
          }}
          rowTextForSelection={(item) => {
            return item;
          }}
          buttonStyle={styles.dropdownButton}
          buttonTextStyle={styles.dropdownButtonText}
          dropdownStyle={styles.dropdownDropdownStyle}
          rowTextStyle={styles.dropdownRowText}
        />

        
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonOne} onPress={handleSubmit}>
          <Text style={styles.buttonText}>List Book</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonTwo} onPress={handleReset}>
          <Text style={styles.buttonText}>Reset Fields</Text>
        </TouchableOpacity>
      </View>
    </View>
    {/* </KeyboardAvoidingView> */}
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '90%',
    height: '98%',
    flexGrow: 0,
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 20,
    margin: "auto",
    marginTop: "2%",
  },
  scanIcon:{
    marginTop:0,
    marginBottom:10,
  },
  inputContainer: {
    marginBottom: 20,
    width: 300,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "red",
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: "white",
  },
  invalidInput: {
    borderColor: "red",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 0,
  },
  buttonOne: {
    backgroundColor: "#00592e",
    padding: 10,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  buttonTwo: {
    backgroundColor: "#00592e",
    padding: 10,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    width: 300,
    height: 40,
    marginBottom: 15,
  },
  dropdownButtonText: {
    textAlign: "left",
    fontSize: 16,
    color: "rgba(0, 0, 0, 0.3)",
  },
  dropdownDropdownStyle: {
    backgroundColor: "white",
  },
  dropdownRowText: {
    fontSize: 16,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  iconTextContainer: {
    textAlign: "center",
    marginBottom: 20,
  },
});
