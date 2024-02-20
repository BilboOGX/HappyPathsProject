import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { User, onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from '../../FireBaseConfig';
import BookForm from '../Componants/BookForm/form';

const ListNewBook = () => {
  return (
    <View>
      <BookForm/>
    </View>
  )
}

export default ListNewBook