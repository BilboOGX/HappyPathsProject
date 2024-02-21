import { View, Text, Button, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { User, onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from '../../FireBaseConfig';
import BookForm from '../Componants/BookForm/form';
import ScanButton from '../Componants/BookForm/Button';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BarCodeScan from '../Componants/BookForm/BarcodeScanner';

const Stack = createNativeStackNavigator();


const ListNewBook = ({ navigation }) => {
  return (
    <ScrollView>
    <View>
      <ScanButton navigation={navigation} />
      <BookForm/>
    </View>
    </ScrollView>
  )
}

export default ListNewBook