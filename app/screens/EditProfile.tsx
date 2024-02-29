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
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { updateProfile } from "firebase/auth";

const EditProfile = ({ route, navigation }) => {
  const user = route.params.user;

  const [currUser, setCurrUser] = useState(user);
  const [selectedImage, setSelectedImage] = useState(user.photoURL);
  const [userDisplayName, setUserDisplayName] = useState(user.username);
  const [userEmail, setUserEmail] = useState(user.email);
  const [userLocation, setUserLocation] = useState(
    user.location ? user.location : "Manchester"
  );

  const handleSubmitChanges = () => {
    const docRef = doc(FIREBASE_DB, "users", currUser.uid);
    const data = {
      email: userEmail,
      username: userDisplayName,
      location: userLocation,
      photoURL: selectedImage,
    };
    updateDoc(docRef, data)
      .then((docRef) => {})
      .catch((error) => {
        console.log(error);
      });
    updateProfile(FIREBASE_AUTH.currentUser, {
      displayName: userDisplayName,
      photoURL: selectedImage,
    })
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
    getDoc(docRef).then((res) => {
      navigation.navigate("Profile", {
        updatedUser: res.data(),
      });
      setCurrUser(res.data());
    });
  };
  const handleImageSelection = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profile}>
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
          <TouchableOpacity style={styles.button} onPress={handleSubmitChanges}>
            <Text style={styles.buttonText}>Submit Changes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00592e",
    padding: 20,
  },
  profile: {
    justifyContent: "center",
    alignSelf: "center",
    width: "95%",
    height: "100%",
    flexGrow: 0,
    padding: 0,
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 20,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 50,
    margin: 5,
  },
  button: {
    backgroundColor: "#00592e",
    padding: 10,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    margin: 1,
  },
  buttonText: {
    color: "white",
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: -100,
    marginBottom: 50,
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
    marginLeft: 20,
    marginRight: 20,
  },
  infoLabel: {
    fontWeight: "bold",
  },
  infoValue: {
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
  },
});

export default EditProfile;
