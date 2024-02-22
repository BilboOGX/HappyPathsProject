
import { View, Text, ImageBackground, Button} from 'react-native'
import React, { useEffect, useState } from 'react'
import { User, onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from '../../FireBaseConfig';
import BookForm from '../Components/BookForm/form';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();


const ListNewBook = ({ navigation }) => {
  return (

    <ImageBackground 
    source={require('../../Images/wp13203104.jpg')}
    style={{flex: 1}} 
  >
    <View style={{flex: 1}}>
      <BookForm/>
    </View>
  </ImageBackground>


  )
}

export default ListNewBook