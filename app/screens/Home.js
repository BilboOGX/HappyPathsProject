import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "../../FireBaseConfig";
import ListItem from "../../chatComponents/ListItem"
import { Button } from "react-native-elements";

export default function Home({ navigation }) {
  const [users, setUsers] = useState([]);
  const logoutUser = async () => {
    auth.signOut().then(() => {
      navigation.replace("LoginChat");
    });
  };

  const getUsers = () => {
    const docsRef = collection(db, "users");
    const q = query(docsRef, where("userUID", "!=", auth?.currentUser?.uid));
    console.log(auth?.currentUser?.uid, 'UID IN HOME.JS')
    const docsSnap = onSnapshot(q, (onSnap) => {
      let data = [];
      onSnap.docs.forEach((user) => {
        data.push({ ...user.data() });
        setUsers(data);
        console.log(user.data());
      });
    });
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
    <View style={styles.container}>
      <FlatList 
        data={users}
        key={(user) => user.email}
        renderItem={({ item }) => (
          <ListItem
            title={item.username}
            subTitle={item.email}
            image={item.avatarUrl}
            onPress={() =>
              navigation.navigate("Chat", {
                name: item.username,
                uid: item.userUID,
              })
            }
          />
        )}
      />
      </View>
      <Button title="Logout" onPress={logoutUser} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00592e',}
  })

