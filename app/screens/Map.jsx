import { FIREBASE_DB } from "../../FireBaseConfig";
import { collection, getDocs } from "firebase/firestore";
import React, { useState, useRef, useEffect } from "react";
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from "react-native-maps";
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function Map({ navigation }: any) {
  const [data, setData] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const mapRef = useRef(null);
  const [dark, setDark] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const isFocused = useIsFocused();

  const fetchDataFromFirestore = async () => {
    try {
      const collectionRef = collection(FIREBASE_DB, "books");
      const snapshot = await getDocs(collectionRef);
      const fetchedData = [];
      snapshot.forEach((doc) => {
        fetchedData.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchDataFromFirestore();
    }
  }, [isFocused]);

  const handleZoomIn = () => {
    mapRef.current?.getCamera().then((cam) => {
      const zoomLevel = getZoomForPlatform(cam.zoom, true);
      cam.zoom = zoomLevel;
      mapRef.current?.animateCamera(cam);
    });
  };

  const handleZoomOut = () => {
    mapRef.current?.getCamera().then((cam) => {
      const zoomLevel = getZoomForPlatform(cam.zoom);
      cam.zoom = zoomLevel;
      mapRef.current?.animateCamera(cam);
    });
  };

  const getZoomForPlatform = (currentZoom, zoomOut = false) => {
    let zoomLevel = currentZoom;
    if (Platform.OS === "android") {
      zoomLevel = zoomOut ? zoomLevel - 1 : zoomLevel + 1;
    } else if (Platform.OS === "ios") {
      zoomLevel = zoomOut ? currentZoom * 1.1 : currentZoom / 1.1;
    } else {
      zoomLevel = zoomOut ? zoomLevel - 1 : zoomLevel + 1;
    }
    return zoomLevel;
  };

  const checkDuplicateCoordinates = (data) => {
    const coordinatesSet = new Set();
    const arr = [];

    for (const item of data) {
      const { latitude, longitude } = item.coords;
      const coordinatesKey = `${latitude},${longitude}`;

      if (coordinatesSet.has(coordinatesKey)) {
        arr.push(coordinatesKey);
      } else {
        const index = arr.indexOf(coordinatesKey);
        if (index !== -1) {
          arr.splice(index, 1);
        }
        coordinatesSet.add(coordinatesKey);
      }
    }
    return arr;
  };

  const duplicateCoordinates = checkDuplicateCoordinates(data);
  const duplicateTitles = [];
  data.forEach((item) => {
    const getCoordinates = `${item.coords.latitude},${item.coords.longitude}`;

    duplicateCoordinates.forEach((coordinates) => {
      if (
        coordinates === getCoordinates &&
        !duplicateTitles.includes(item.bookTitle)
      ) {
        duplicateTitles.push(item.bookTitle);
      }
    });
  });

  return (
    <View>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsUserLocation={true}
        followsUserLocation={true}
        showsMyLocationButton={true}
        customMapStyle={dark ? nightMap : mapStyle}
        onUserLocationChange={(event) => {
          if (!userLocation) {
            setUserLocation(event.nativeEvent.coordinate);
          }
        }}
        region={
          userLocation
            ? {
                ...userLocation,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
              }
            : null
        }
      >
        {data.map((loc) => {
          if (loc.bookTitle === undefined) {
            loc.bookTitle = "no information available";
          }

          if (loc.bookAuthor === undefined) {
            loc.bookAuthor = "no information available";
          }

          if (loc.bookPreview === undefined) {
            loc.bookDesc = "no information available";
          }

          if (loc.bookCondition === undefined) {
            loc.bookCondition = "no information available";
          }

          if (loc.bookRating === undefined) {
            loc.bookRating = "no information available";
          }

          if (loc.genre === undefined) {
            loc.genre = "no information available";
          }

          if (loc.user === undefined) {
            loc.user = "no information available";
          }

          const getCoordinates = `${loc.coords.latitude},${loc.coords.longitude}`;

          if (!duplicateCoordinates.includes(getCoordinates)) {
            return (
              <Marker
                coordinate={{
                  latitude: loc.coords.latitude,
                  longitude: loc.coords.longitude,
                }}
                title={`Name: ${loc.bookTitle}`}
                description={loc.bookAuthor}
                key={loc.id}
                calloutContainerStyle={styles.calloutContainer}
              >
                <Callout
                  style={styles.calloutContainer}
                  onPress={() =>
                    navigation.navigate("SingleBookPage", {
                      id: loc.id,
                      uid: loc.userID,
                    })
                  }
                >
                  <Text style={styles.calloutTitle}>
                    Title: {loc.bookTitle}
                  </Text>
                  <Text style={styles.calloutDescription}>
                    Author: {loc.bookAuthor}
                  </Text>
                  <Text style={styles.calloutDescription}>
                    Genre: {loc.genre}
                  </Text>
                  <Text style={styles.calloutDescription}>
                    Rating: {loc.bookRating}
                  </Text>
                  <Text style={styles.calloutDescription}>
                    Condition: {loc.bookCondition}
                  </Text>
                  <Text style={styles.calloutDescription}>
                    User: {loc.user}
                  </Text>
                </Callout>

                <View style={styles.nameAndImageContainer}>
                  <Text style={styles.markerBookTitle}>{loc.bookTitle}</Text>
                  <View style={styles.ImageContainer}>
                    <Image
                      source={require("../../Images/Colorful-books-on-transparent-background-PNG Background Removed.png")}
                      style={styles.markerImage}
                    ></Image>
                  </View>
                </View>
              </Marker>
            );
          } else if (duplicateCoordinates.includes(getCoordinates)) {
            const finalArr = [];
            data.forEach((item) => {
              if (
                loc.coords.latitude === item.coords.latitude &&
                loc.coords.longitude === item.coords.longitude &&
                !finalArr.includes(item.bookTitle)
              ) {
                finalArr.push(item.bookTitle);
              }
            });

            return (
              <Marker
                coordinate={{
                  latitude: loc.coords.latitude,
                  longitude: loc.coords.longitude,
                }}
                title={"Multiple Listings"}
                key={loc.id}
                calloutContainerStyle={styles.calloutContainer}
              >
                <Callout
                  tooltip
                  style={styles.bubble}
                  onPress={() =>
                    navigation.navigate("SingleBookPage", {
                      id: loc.id,
                      uid: loc.userID,
                    })
                  }
                >
                  <Text style={styles.toolTipTitles}>Book Titles {"\n"}</Text>
                  {finalArr.map((item, index) => (
                    <Text key={index}>
                      {item}
                      {"\n"}
                    </Text>
                  ))}
                </Callout>

                <View style={styles.nameAndImageContainer}>
                  <View style={styles.ImageContainer}>
                    <Image
                      source={require("../../Images/Colorful-books-on-transparent-background-PNG Background Removed.png")}
                      style={styles.markerImage}
                    ></Image>
                  </View>
                </View>
              </Marker>
            );
          }
        })}
      </MapView>

      <TouchableOpacity onPress={handleZoomIn} style={styles.zoomInButton}>
        <Text style={styles.buttonTextIn}>+</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleZoomOut} style={styles.zoomOutButton}>
        <Text style={styles.buttonTextOut}>-</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setDark(!dark)}
        style={{
          backgroundColor: "#FFF",
          borderColor: "black",
          borderWidth: 2,
          height: 55,
          borderRadius: 40,
          width: 55,
          alignContent: "center",
          justifyContent: "center",
          position: "absolute",
          marginTop: 30,
          alignSelf: "flex-end",
          right: 12,
        }}
      >
        <Image
          source={require("../../Images/sun-and-moon-icon-isolated-on-transparent-vector-24794605 Background Removed.png")}
          style={styles.lightAndDarkIcon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: width,
    height: 675,
  },
  nameAndImageContainer: {
    padding: 10,
    display: "flex",
  },
  markerBookTitle: {
    color: "black",
    fontWeight: "bold",
    fontFamily: "Arial",
    fontSize: 12,
    padding: 1,
    marginBottom: 4,
  },
  ImageContainer: {
    display: "grid",
    justifyContent: "center",
    alignItems: "center",
  },
  markerImage: {
    width: 30,
    height: 30,
  },
  lightAndDarkIcon: {
    width: 85,
    height: 85,
    right: 15,
    top: 4,
  },

  zoomInButton: {
    position: "absolute",
    bottom: 148,
    right: 11,
    backgroundColor: "grey",
    borderRadius: 100,
    padding: 5,
    width: 55,
    height: 55,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  zoomOutButton: {
    position: "absolute",
    bottom: 80,
    right: 11,
    backgroundColor: "grey",
    borderRadius: 100,
    paddingBottom: 35,
    height: 55,
    width: 55,
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonTextIn: {
    color: "white",
    fontSize: 30,
    textAlign: "center",
  },
  buttonTextOut: {
    color: "white",
    fontSize: 60,
    paddingBottom: 40,
  },

  bubble: {
    width: 300,
    padding: 10,
    backgroundColor: "gold",
    color: "white",
  },
  toolTipTitles: {
    color: "black",
    fontWeight: "bold",
    fontFamily: "Arial",
    fontSize: 12,
    padding: 1,
    marginBottom: 4,
    textAlign: "center",
  },
});

const mapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#ebe3cd",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#523735",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#f5f1e6",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#c9b2a6",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#dcd2be",
      },
    ],
  },
  {
    featureType: "administrative.land_parcel",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#ae9e90",
      },
    ],
  },
  {
    featureType: "landscape.natural",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#93817c",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#a5b076",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#447530",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#f5f1e6",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#fdfcf8",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#f8c967",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#e9bc62",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [
      {
        color: "#e98d58",
      },
    ],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#db8555",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#806b63",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#8f7d77",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#ebe3cd",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [
      {
        color: "#dfd2ae",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#b9d3c2",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#92998d",
      },
    ],
  },
];

const nightMap = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#242f3e",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#746855",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#242f3e",
      },
    ],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#263c3f",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#6b9a76",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#38414e",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#212a37",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9ca5b3",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#746855",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#1f2835",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#f3d19c",
      },
    ],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [
      {
        color: "#2f3948",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#d59563",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#17263c",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#515c6d",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#17263c",
      },
    ],
  },
];
