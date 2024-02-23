// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAXTqyJ4fUTEC69oLnCPEerFJIalP1opwc",
  authDomain: "chatapp-v2-8b18e.firebaseapp.com",
  projectId: "chatapp-v2-8b18e",
  storageBucket: "chatapp-v2-8b18e.appspot.com",
  messagingSenderId: "928266043432",
  appId: "1:928266043432:web:752c46538e9d78cbfeb51d",
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const auth = getAuth(FIREBASE_APP)
export const database = getFirestore()
export const db = getFirestore(FIREBASE_APP)