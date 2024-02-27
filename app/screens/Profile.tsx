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

const Profile = ({ navigation }: any) => {
  const isFocused = useIsFocused()
  const [users, setUsers] = useState([]);
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
      return fetchedUsers
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isFocused) {

      fetchUsersFromFirestore().then((users) => {
        console.log(users, '<-- users from db fetch')
        users.map((user) => {
          if (user.id === currUser.uid) {
            console.log(user, '<-- matched user?')
            setCurrUser(user)
          }
        })
      })
    }
  }, [isFocused]); 
  // useEffect isn't loading user immediately
  // also not refreshing after user has been updated in edit profile
  // console.log(currUser, '<-- curr user after use effect?')
  // console.log(isFocused, '<-- is focused?')

  if (isFocused) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: currUser.photoURL }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{currUser.username}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Email: </Text>
        <Text style={styles.infoValue}>{currUser.email}</Text> 
        {/* why does it immediately get the current user's email but not immediately get other properties? */}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Location: </Text>
        <Text style={styles.infoValue}>{currUser.location}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>User ID:</Text>
        <Text style={styles.infoValue}>{currUser.userUID}</Text>
      </View>
      {/* add location on here too  */}
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => navigation.navigate("EditProfile", {
            user: currUser
          })}
          title="Edit Profile"
        />
        <Button
          onPress={() => navigation.navigate("MyListings", {
            user: currUser
          })}
          title="Go to my listings"
        />
        <Button
          onPress={() => navigation.navigate("MyFavourites", { uid: currUser.userUID })}
          title="Go to my favourites"
        />
        <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout" />
      </View>
    </SafeAreaView>
  );
};
}

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
  },
});

export default Profile;