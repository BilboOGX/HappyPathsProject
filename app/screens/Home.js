import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "../../FireBaseConfig";
import ListItem from "../../chatComponents/ListItem";
import { Button } from "react-native-elements";

export default function Home({ navigation }) {
  const [users, setUsers] = useState([]);
  const getUsers = () => {
    const docsRef = collection(db, "users");
    const q = query(docsRef, where("uid", "!=", auth?.currentUser?.uid));
    const docsSnap = onSnapshot(q, (onSnap) => {
      let data = [];
      onSnap.docs.forEach((user) => {
        console.log(user.data())
        data.push({ ...user.data() });
        setUsers(data);
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
              image={item.photoURL}
              onPress={() =>
                navigation.navigate("Chat", {
                  name: item.username,
                  uid: item.uid,
                })
              }
            />
          )}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#00592e",
  },
});
