import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { FIREBASE_AUTH, db } from "../../FireBaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const { width, height } = Dimensions.get("window");

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.log(error);
      alert("Sign in failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      ).then((userCredentials) => {
        const userUID = userCredentials.user.uid;
        const docRef = doc(db, "users", userUID);
        const docSnap = setDoc(docRef, {
          photoURL: "https://avatar.iran.liara.run/public",
          username: email,
          password: password,
          uid: userUID,
          email: email,
        });
      });

      alert("Check your emails!");
    } catch (error: any) {
      console.log(error);
      alert("Sign in failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <View>
        <View style={styles.imageContainer}>
          <Image
            source={require("../../Images/Green and Beige Flat & Minimal Book Shop Logo/logoMain.png")}
            style={styles.logoImage}
          ></Image>
        </View>
      </View>

      <KeyboardAvoidingView behavior="padding">
        <TextInput
          value={email}
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
        ></TextInput>
        <TextInput
          secureTextEntry={true}
          value={password}
          style={styles.input}
          placeholder="Password"
          autoCapitalize="none"
          onChangeText={(text) => setPassword(text)}
        ></TextInput>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <View style={styles.buttonContainer}>
              <View style={styles.loginButtonContainer}>
                <TouchableOpacity
                  onPress={signIn}
                  style={styles.transparentButton}
                >
                  <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.signUpButtonContainer}>
                <TouchableOpacity
                  onPress={signUp}
                  style={styles.transparentButton}
                >
                  <Text style={styles.signUpButtonText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#00592e",
    marginTop: -100,
  },
  recycleImageContainer: {
    height: 80,
    width: width,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  recycleLogoImage: {
    height: 350,
    width: 350,
  },
  imageContainer: {
    alignItems: "center",
  },
  logoImage: {
    height: 300,
    width: 300,
    marginBottom: -50,
    marginTop: 50,
  },
  input: {
    marginHorizontal: 20,
    height: 50,
    width: 350,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonContainer: {
    color: "white",
    borderColor: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginTop: 30,
  },
  loginButtonContainer: {
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 8,
    height: 50,
    width: 165,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpButtonContainer: {
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 8,
    height: 50,
    width: 165,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  signUpButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
