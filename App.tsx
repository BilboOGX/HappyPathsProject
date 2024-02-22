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
import BarCodeScan from "./app/Componants/BookForm/BarcodeScanner";


const Stack = createNativeStackNavigator();

const InsideStack = createNativeStackNavigator();

const Tab = createBottomTabNavigator()



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
      <Tab.Screen name="Map" component={Map}/>
      <Tab.Screen name="BookList" component={BookList} />
      <Tab.Screen name="+" component={ListNewBook}/>
      <Tab.Screen name="My listings" component={MyListings}/>
      <Tab.Screen name="Profile" component={Profile}/>
      <Tab.Screen name="SingleBookPage" component={SingleBookPage}/>
  
    </Tab.Navigator>
  )
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
          <Stack.Screen
            name="Inside"
            component={BottomTabsLayout}
            options={{ headerShown: false }}
          />
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
          options={{ title: "Profile" }}
        />
        <Stack.Screen name="BarCodeScan" component={BarCodeScan} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
