import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "./FireBaseConfig";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import {
  Login,
  Map,
  BookList,
  ListNewBook,
  Profile,
  MyListings,
  SingleBookPage,
  BarCodeScan,
  EditProfile,
  MyFavourites,
} from "./app/index";


import Signup from "./app/screens/Signup";
import Home from "./app/screens/Home";
import Chat from "./app/screens/Chat";
import LoginChat from "./app/screens/LoginChat";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ChatTabsLayout() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={({ route }) => ({
          title: route.params.name,
          headerTitleStyle: { fontWeight: "bold" },
          headerTitleAlign: "center",
        })}
      />
    </Stack.Navigator>
  );
}

function BottomTabsLayout() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Map"
        component={Map}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size}/>
          ),
        }}
      />
      <Tab.Screen
        name="Book List"
        component={BookList}
        options={{
          tabBarLabel: "All Books",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="List Your Book"
        component={ListNewBook}
        options={{
          tabBarLabel: "List Book",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-outline" color={color} size={34} />
          ),
        }}
      />
      <Tab.Screen
        name="Chats"
        component={ChatTabsLayout}
        options={{
          tabBarLabel: "Chat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <>
            <Stack.Screen
              name="Inside"
              component={BottomTabsLayout}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SingleBookPage"
              component={SingleBookPage}
              options={{ headerShown: true, headerBackTitle: 'Back', title: ''}}
            />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
        )}

        <Stack.Screen name="ListNewBook" component={ListNewBook} />
        <Stack.Screen name="BarCodeScan" component={BarCodeScan} />

        <Stack.Screen
          name="MyListings"
          component={MyListings}
          options={{ headerBackTitle: "Back to profile" }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{ headerBackTitle: "Back to profile" }}
        />
        <Stack.Screen
          name="MyFavourites"
          component={MyFavourites}
          options={{ headerBackTitle: "Back to profile" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
