import { View, Text, ImageBackground} from 'react-native'
import React, { useEffect, useState } from 'react'
import { User, onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from '../../FireBaseConfig';
import BookForm from '../Components/BookForm/form';

const ListNewBook = () => {
  return (
    <ImageBackground 
    source={require('/Users/ste/Documents/Coding/Northcoders/projects/HappyPathsProject/Images/wp13203104.jpg')}
    style={{flex: 1}} 
  >
    <View style={{flex: 1}}>
      <BookForm/>
    </View>
  </ImageBackground>
  )
}

export default ListNewBook