import {
  View,
  Text,
  Image,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../FireBaseConfig";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

const EditProfile = ({ route, navigation }) => {
  const user = route.params.user;

  const [currUser, setCurrUser] = useState(user);
  const [selectedImage, setSelectedImage] = useState(user.photoURL);
  const [userDisplayName, setUserDisplayName] = useState(user.username);
  const [userEmail, setUserEmail] = useState(user.email);
  const [userLocation, setUserLocation] = useState(user.location ? user.location : "Manchester");

  // console.log(userDisplayName, "<-- display name");
  // console.log(userEmail, "<-- user email");
  // console.log(userLocation, "<-- user location");
  // console.log(selectedImage, "<-- user photo");

  const handleSubmitChanges = () => {
    // console.log("submit func");
    // console.log(currUser, '<-- current user in handle submit')
    const docRef = doc(FIREBASE_DB, "users", currUser.userUID);
    const data = {
      email: userEmail,
      username: userDisplayName,
      location: userLocation,
      photoURL: selectedImage,
    };
    updateDoc(docRef, data)
      .then((docRef) => {
        // console.log("updated");
      })
      .catch((error) => {
        console.log(error);
      })
      updateProfile(FIREBASE_AUTH.currentUser, {
        displayName: userDisplayName,
        photoURL: selectedImage
      }).then(() => {
        // console.log("auth updated")
      }).catch((error) => {
        console.log(error)
      })
      getDoc(docRef).then((res) => {
        navigation.navigate('Profile', {
          updatedUser: res.data()
        })
          setCurrUser(res.data())
        })
        // .finally(() => {
        //   navigation.navigate('Profile', {
        //     updatedUser: currUser
        //   })
        // })
      
    
    // maybe add a navigate back to profile, sending updated user info as a route param to then update profile? --> doesn't send most up to date user, because it's chained in a finally? 
  };
  const handleImageSelection = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (!result.canceled) {
      // console.log(result.assets[0].uri, '<-- image picker result')
      setSelectedImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    console.log("use effect triggered");
    console.log(currUser, '<-- curr user in use effect?')
  }, [handleSubmitChanges]);

console.log(currUser, '<-- curr user just before return rendering')

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={handleImageSelection}>
          <Image
            source={{
              uri: selectedImage,
            }}
            style={styles.avatar}
          />
          <View style={styles.photoButton}>
            <MaterialIcons name="photo-camera" size={24} color="black" />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Display Name: </Text>
        <TextInput
          style={styles.infoValue}
          placeholder={currUser.username}
          onChangeText={(value) => setUserDisplayName(value)}
        ></TextInput>
        {/* <TextInput value={name} onChangeText={value => setName(value)} editable={true}></TextInput> */}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Email: </Text>
        <TextInput
          style={styles.infoValue}
          placeholder={currUser.email}
          onChangeText={(value) => setUserEmail(value)}
        ></TextInput>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Location: </Text>
        <TextInput
          style={styles.infoValue}
          placeholder={userLocation}
          onChangeText={(value) => setUserLocation(value)}
        ></TextInput>
      </View>
      <View style={styles.buttonContainer}>
        <Button onPress={handleSubmitChanges} title="Submit Changes" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: "black",
  },
  photoButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 9999,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  infoContainer: {
    marginTop: 20,
  },
  infoLabel: {
    fontWeight: "bold",
  },
  infoValue: {
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 4,
    padding: 4,
  },
});

export default EditProfile;
