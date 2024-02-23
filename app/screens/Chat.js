import { StyleSheet, Text, View } from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { auth } from "../../FireBaseConfig.ts";

import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../FireBaseConfig.ts";

export default function Chat({ route }) {
  const uid = route.params.uid;
  console.log(route.params.uid, 'ROUTE PARAMS UID')
  console.log(route.params, "ROUTE PARAMS CHAT JSX");

  const [messages, setMessages] = useState([]);
  const currentUser = auth?.currentUser?.uid;

  console.log(currentUser, 'CURRENT USER ID')

  useEffect(() => {
    const chatId =
      uid > currentUser
        ? `${uid + "-" + currentUser}`
        : `${currentUser + "-" + uid}`;
    const docRef = doc(db, "chatrooms", chatId);
    console.log(chatId, 'chatID')
    console.log(docRef, '<<<<docref')
    const colRef = collection(docRef, "messages");
    const q = query(colRef, orderBy("createdAt", "desc"));
    const docSnap = onSnapshot(q, (onSnap) => {
      const allMsg = onSnap.docs.map((mes) => {
        if (mes.data.createdAt) {
          return {
            ...mes.data(),
            createdAt: mes.data().createdAt.toDate(),
          };
        } else {
          return {
            ...mes.data(),
            createdAt: new Date(),
          };
        }
      });
      setMessages(allMsg);
    });
  }, []);

  const onSend = useCallback((messagesArray) => {
    console.log(currentUser, "<< curr user");
    console.log(uid, "<< uid");
    const msg = messagesArray[0];
    const myMsg = {
      ...msg,
      sentBy: currentUser,
      sentTo: uid,
    };

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, myMsg)
    );
    const chatId =
      uid > currentUser
        ? `${uid + "-" + currentUser}`
        : `${currentUser + "-" + uid}`;
    const docRef = doc(db, "chatrooms", chatId);
    const colRef = collection(docRef, "messages");
    const chatSnap = addDoc(colRef, {
      ...myMsg,
      createdAt: serverTimestamp(),
    });
  }, []);
  return (
    <GiftedChat
      messages={messages}
      onSend={(text) => onSend(text)}
      user={{
        _id: currentUser,
      }}
    />
  );
}
const styles = StyleSheet.create({});
