import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import { collection, addDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../FireBaseConfig';
import { User, onAuthStateChanged } from "firebase/auth";
import { fetchGeoLocation } from '../../AxiosRequests';

export default function BookForm(){
  const [bookTitle, setBookTitle] = useState('');
  const [bookAuthor, setBookAuthor] = useState('');
  const [seller, setSeller] = useState('');
  const [postcode, setPostcode] = useState('');
  const [isPostcodeValid, setIsPostcodeValid] = useState(true);
  const [bookDesc, setBookDesc] = useState('')
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)

  const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        onAuthStateChanged(FIREBASE_AUTH, (user) => {
          setUser(user.email);
        });
      }, []);

  function isValidUKPostcode(postcode) {
    const pattern = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
    return pattern.test(postcode);
  }

  function handleSubmit(){
    setAttemptedSubmit(true)

    if (!bookTitle.trim() || !bookAuthor.trim() || !postcode.trim() || !bookDesc.trim()) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }
    if (!isValidUKPostcode(postcode)) {
      Alert.alert('Invalid Postcode', 'Please enter a valid UK postcode.');
      return;
    }
   

      
    fetchGeoLocation(postcode).then((response) => {
      const latitude = response.data.results[0].geometry.location.lat;
      const longitude = response.data.results[0].geometry.location.lng;
    
      return addDoc(collection(FIREBASE_DB, "books"), {
      bookTitle,
      bookAuthor,
      user,
      coords: {latitude, longitude },
      bookDesc
    })
  })
    .then((docRef) => {
      Alert.alert('Book successfully posted!');
      setBookTitle('')
      setBookAuthor('')
      setPostcode('')
      setBookDesc('')
    
    })
    .catch((error) => {
      console.error(error);
    });
  };

  return (
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
        onChangeText={text => setBookAuthor(text)}
        style={[styles.input, attemptedSubmit && !bookAuthor.trim() && styles.invalidInput]}
      />
      </View>

      {/* <View style={styles.inputContainer}>
      <TextInput
        placeholder="Seller"
        value={user}
        // onChangeText={text => setSeller(text)}
        style={[styles.input, attemptedSubmit && !seller.trim() && styles.invalidInput]}
      />
      </View> */}

      <View style={styles.inputContainer}>
      <TextInput
        placeholder="Book Description"
        value={bookDesc}
        onChangeText={text => setBookDesc(text)}
        style={[styles.input, attemptedSubmit && !bookDesc.trim() && styles.invalidInput]}
      />
      </View>

      <View style={styles.inputContainer}>
      <TextInput
        placeholder="Postcode"
        value={postcode}
        onChangeText={(text) => {
          setPostcode(text)
          setIsPostcodeValid(isValidUKPostcode(text));
        }}
        style={[styles.input, attemptedSubmit && !isPostcodeValid && styles.invalidInput]}
      />
      <Text>Enter the postcode of your book location</Text>
      </View>


      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'red',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  invalidInput: {
    borderColor: 'red',
  },
});