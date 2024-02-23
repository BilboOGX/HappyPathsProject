import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Login from "./app/screens/Login";
import List from "./app/screens/Profile";
import Details from "./app/screens/Details";
import { useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { FIREBASE_AUTH } from "./FireBaseConfig";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Map from "./app/screens/Map";
import MyListings from "./app/screens/MyListings";
import BookList from "./app/screens/BookList";
import ListNewBook from "./app/screens/ListNewBook";
import Profile from "./app/screens/Profile";
import SingleBookPage from "./app/screens/SingleBookPage";
import BarCodeScan from "./app/Components/BarcodeScanner/BarcodeScanner";
import { Ionicons } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();

const InsideStack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="My todos" component={List} />
      <InsideStack.Screen name="Details" component={Details} />
    </InsideStack.Navigator>
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
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="BookList"
        component={BookList}
        options={{
          tabBarLabel: "booklist",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="+"
        component={ListNewBook}
        options={{
          tabBarLabel: "Add",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-outline" color={color} size={34} />
          ),
        }}
      />
      <Tab.Screen
        name="chat"
        component={ListNewBook}
        options={{
          tabBarLabel: "chat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: "profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen name="My listings" component={MyListings} />
      {/* <Tab.Screen name="SingleBookPage" component={SingleBookPage} /> */}
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log("user", user);
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
          options={{ headerShown: true }}
        />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
        )}
        
        <Stack.Screen
          name="ListNewBook"
          component={ListNewBook}
        />
        <Stack.Screen name="BarCodeScan" component={BarCodeScan} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
