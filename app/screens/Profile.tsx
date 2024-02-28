import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../FireBaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useIsFocused } from "@react-navigation/native";

const Profile = ({ navigation, route }: any) => {
  const checkForUpdate = () => {
    if (route.params === undefined) {
      setCurrUser(FIREBASE_AUTH.currentUser);
    } else {
      setCurrUser(route.params.updatedUser);
    }
  };
  const isFocused = useIsFocused();
  const [currUser, setCurrUser] = useState(FIREBASE_AUTH.currentUser);
  const fetchUsersFromFirestore = async () => {
    try {
      const collectionRef = collection(FIREBASE_DB, "users");
      const snapshot = await getDocs(collectionRef);
      const fetchedUsers = [];
      snapshot.forEach((user) => {
        fetchedUsers.push({
          id: user.id,
          ...user.data(),
        });
      });
      return fetchedUsers;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchUsersFromFirestore().then((users) => {
        users.map((user) => {
          if (user.id === currUser.uid) {
            setCurrUser(user);
          }
        });
      });
      checkForUpdate();
    }
  }, [isFocused]);


  // if route.params.updatedUser !== null/undefined, render those details, otherwise render these current ones
  // if (route.params !== undefined) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.profile}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: currUser.photoURL }} style={styles.avatar} />
            <Text style={styles.name}>{currUser.username}</Text>
          </View>
    
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Email: </Text>
            <Text style={styles.infoValue}>{currUser.email}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Location: </Text>
            <Text style={styles.infoValue}>{currUser.location}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>User ID:</Text>
            <Text style={styles.infoValue}>{currUser.uid}</Text>
          </View>
          <View style={styles.maninButtonContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonTwo} onPress={() => navigation.navigate("EditProfile", {
                user: currUser,
              })}>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
    
            <TouchableOpacity style={styles.buttonTwo} onPress={() => navigation.navigate("MyListings", {
                user: currUser,
              })}>
              <Text style={styles.buttonText}>My Listings</Text>
            </TouchableOpacity>
    
            <TouchableOpacity style={styles.buttonTwo} onPress={() => navigation.navigate("MyFavourites", { uid: currUser.uid })}>
              <Text style={styles.buttonText}>My Favourites</Text>
            </TouchableOpacity>
    
            <TouchableOpacity style={styles.buttonTwo} onPress={() => FIREBASE_AUTH.signOut()}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
        </View>
      </SafeAreaView>
    );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00592e',
    padding: 0,
  },
  profile: {
    justifyContent: 'center',
    alignSelf: 'center',
    width: '95%',
    height: '100%',
    flexGrow: 0,
    padding: 0,
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 20,
    
  },
  // buttonContainer: {
  //   alignItems: "center",
  //   marginTop: 0,
  // },
  avatarContainer: {
    alignItems: "center",
    marginTop: 0,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: "black",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 3,
    marginBottom: 10,
  },
  infoContainer: {
    marginTop: 5,
    marginLeft: 20,
    marginBottom: 5,
  },
  infoLabel: {
    fontWeight: "bold",
  },
  infoValue: {
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "column",
    width: "50%",
    marginTop: 15,
  },
  buttonTwo: {
    backgroundColor: "#00592e",
    padding: 10,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    margin:1,

  },
  maninButtonContainer: {
    alignItems: 'center',
    margin:5,
    marginTop: 10,
   },
  buttonText:{
    color: 'white',
  }
});

export default Profile;
