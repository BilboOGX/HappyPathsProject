import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import LinearGradient from 'react-native-linear-gradient';
import { FIREBASE_AUTH } from "../../FireBaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);

      console.log(response);
    //   alert("Check your emails!");
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
      );

      console.log(response);
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
              <Button title="Login" onPress={signIn} />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Create account" onPress={signUp} />
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
    backgroundColor: '#252f40'
  },
  input: {
    marginHorizontal: 20, 
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  buttonContainer: {
    padding: 5,
  },
});





// return (
//   <LinearGradient
//     colors={['#4c669f', '#3b5998', '#192f6a']}
//     style={{flex: 1, padding: 20}}
//   >
//     <Text style={{fontSize: 24, marginBottom: 20}}>Login</Text>
//     <TextInput placeholder="Username" style={{backgroundColor: 'white', marginBottom: 10}} />
//     <TextInput placeholder="Password" style={{backgroundColor: 'white', marginBottom: 20}} />
//     <Button title="Login" onPress={() => {}} />
//   </LinearGradient>