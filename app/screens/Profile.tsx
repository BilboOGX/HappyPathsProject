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
import { MaterialIcons } from "@expo/vector-icons";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../FireBaseConfig";
import { collection, getDocs } from "firebase/firestore";

const Profile = ({ navigation }: any) => {
  const [users, setUsers] = useState([]);
  const [currUser, setCurrUser] = useState(FIREBASE_AUTH.currentUser);
  const fetchUserFromFirestore = async () => {
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
      setUsers(fetchedUsers);
    } catch (error) {
      console.log(error);
    }
  };
  // console.log(users, '<-- users in profile')
  // console.log(FIREBASE_AUTH.currentUser, '<-- current user')
  useEffect(() => {
    fetchUserFromFirestore()
    // .then(() => assignCurrUser(FIREBASE_AUTH.currentUser.uid))
  }, []); // need something to refresh when user is updated, currUser causes infinite loop
  // const assignCurrUser = (id) => {
  //   for (let i = 0; i < users.length; i++) {
  //     if (users[i].userUID === id) {
  //       setCurrUser(users[i]);
  //     }
  //   }
  // };
  console.log(currUser, "<-- current user?");

  return (
    <SafeAreaView style={styles.container}>
      <View>
        {users.map((user) => {
          {console.log(user, '<-- each user?')}
          if (user.id === currUser.uid) {
            return (
              // if user has avatarURL return that, else return photoURL?
              <SafeAreaView>
                <View style={styles.avatarContainer}>
                  <Image
                    source={{ uri: user.photoURL }}
                    style={styles.avatar}
                  />
                  <Text style={styles.name}>{user.username}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.infoLabel}>Email: </Text>
                  <Text style={styles.infoValue}>{user.email}</Text>
                </View>
                <View style={styles.infoContainer}>
                  <Text style={styles.infoLabel}>User ID:</Text>
                  <Text style={styles.infoValue}>{user.userUID}</Text>
                </View>
              </SafeAreaView>
            );
          }
        })}
      </View>
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => navigation.navigate("EditProfile")}
          title="Edit Profile"
        />
        <Button
          onPress={() => navigation.navigate("MyListings")}
          title="Go to my listings"
        />
        <Button
          onPress={() => navigation.navigate("MyFavourites")}
          title="Go to my favourites"
        />
        <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout" />
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