import { StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import React from "react";
import { Input, Button } from "react-native-elements";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../../FireBaseConfig";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);

  const registerUser = async () => {
    setLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const userUID = userCredentials.user.uid;
        const docRef = doc(db, "users", userUID);
        const docSnap = setDoc(docRef, {
          avatarUrl: avatar ? avatar : "https://avatar.iran.liara.run/public",
          username,
          password,
          userUID,
          email,
        });
      })
      .then(() => console.log("successful"))
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Username"
        label="username"
        value={username}
        onChangeText={(text) => setUsername(text)}
        leftIcon={{ type: "material", name: "account-circle" }}
      />
      <Input
        placeholder="Enter your email"
        label="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        leftIcon={{ type: "material", name: "email" }}
      />
      <Input
        placeholder="Enter your password"
        label="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        leftIcon={{ type: "material", name: "lock" }}
        secureTextEntry
      />

      <Input
        placeholder="Avatar url"
        label="Avatar"
        value={avatar}
        onChangeText={(text) => setAvatar(text)}
        leftIcon={{ type: "material", name: "link" }}
      />
      <Button onPress={registerUser} style={styles.btn} title="Sign up" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btn: {
    marginTop: 10,
  },
});
