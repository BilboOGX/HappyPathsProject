// import { StyleSheet, Text, View } from "react-native";
// import React, { useEffect, useState } from "react";
// import { Input, Button } from "react-native-elements";
// import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../../FireBaseConfig";

// export default function LoginChat({ navigation }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const loginUser = async () => {
//     signInWithEmailAndPassword(auth, email, password)
//       .then(() => {
//         console.log("Logged in successfully");
//       })
//       .catch((error) => {
//         console.log(error);
//         return alert("Sign in failed: " + error.message);
//       });
//   };

//   useEffect(() => {
//     onAuthStateChanged(auth, (user) => {
//       if (user) {
//         navigation.navigate("Home");
//       } else {
//         console.log("no user");
//       }
//     });
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Input
//         placeholder="Enter your email"
//         label="Email"
//         value={email}
//         onChangeText={(text) => setEmail(text)}
//         leftIcon={{ type: "material", name: "email" }}
//       />
//       <Input
//         placeholder="Enter your password"
//         label="Password"
//         value={password}
//         onChangeText={(text) => setPassword(text)}
//         leftIcon={{ type: "material", name: "lock" }}
//         secureTextEntry
//       />
//       <Button onPress={loginUser} title="login" />
//       <Button
//         onPress={() => navigation.navigate("Signup")}
//         style={styles.btn}
//         title="Sign up"
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   btn: {
//     marginTop: 10,
//   },
// });
