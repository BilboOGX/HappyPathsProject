import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  Image,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FIREBASE_DB } from "../../FireBaseConfig";
import { collection, getDocs } from "firebase/firestore";

const SingleBookPage = ({ navigation, route }) => {
  const [data, setData] = useState([]);
  console.log(route, 'ROUTE LOG')
  const routeIdentifier = route.params.id;
  const useruid = route.params.uid;

  console.log(useruid)


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
    fetchDataFromFirestore();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        {/* <View style={styles.routeContainer}>
        <Text style={styles.route}>{routeIdentifier}</Text>
      </View> */}

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

          if (loc.id === routeIdentifier) {
            return (
              <View style={styles.pageContainer}>
                <View style={styles.headingContainer}>
                  <Text style={styles.heading}>{loc.bookTitle}</Text>
                </View>

                <View style={styles.topSection}>
                  <View style={styles.topSectionText}>
                    <View style={styles.titleContainer}>
                      <Text style={styles.titleInfo}>
                        Title: {loc.bookTitle}
                      </Text>
                    </View>

                    <View style={styles.bookAuthorContainer}>
                      <Text style={styles.authorInfo}>
                        Author: {loc.bookAuthor}
                      </Text>
                    </View>

                    <View style={styles.genreContainer}>
                      <Text style={styles.genreInfo}>Genre: {loc.genre}</Text>
                    </View>

                    <View style={styles.bookRatingContainer}>
                      <Text style={styles.bookRatingInfo}>
                        Rating: {loc.bookRating}
                      </Text>
                    </View>

                    <View style={styles.bookConditionContainer}>
                      <Text style={styles.bookConditionInfo}>
                        Condition: {loc.bookCondition}
                      </Text>
                    </View>
                  </View>


                  <View style={styles.genreIconContainer}>
                    <Image
                      source={require("../../Images/fantasyHat.png")}
                      style={styles.genreIcon}
                    ></Image>
                  </View>
                </View>

                <Button title="Order now" />
                  <Button
             title="Chat now"
           
                // onPress={navigation.navigate("Chat", {
                //   userID: useruid,
                // })}
                onPress={() => navigation.navigate("Chat", { uid: useruid, name: loc.user
                })}
                // onPress={() => console.log(useruid)}
              />

                <View style={styles.bookPreviewContainer}>
                  <Text style={styles.synopsisHeading}>Synopsis</Text>
                  <Text style={styles.bookPreviewInfo}>
                    {loc.bookPreview}
                  </Text>
                </View>

                <View style={styles.userContainer}>
                  <Text style={styles.userInfo}>User: {loc.user}</Text>
                  <Image
                      source={require("../../Images/fantasyHat.png")}
                      style={styles.userProfilePicture}
                    ></Image>
                </View>

                
              </View>
            );
          }
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#00592e",
  },
  headingContainer: {
    borderColor: "white",
    borderWidth: 2,
    marginTop: 50,
    marginBottom: 30,
    padding: 10,
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },

  pageContainer: {
    marginVertical: 20,
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 10,
    borderColor: "white",
    borderWidth: 2,
  },

  topSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: 50,
  },
  genreIconContainer: {
    borderColor: "white",
    borderWidth: 2, 
    borderRadius: 10,
    height: 180, 
    width: 110,
    justifyContent: "center",
    alignItems: "center",
  },
  genreIcon: {
    height: 80, 
    width: 80
  },

  titleContainer: {
    marginBottom: 10,
  },
  titleInfo: {
    fontSize: 16,
    color: "white",
  },
  bookAuthorContainer: {
    marginBottom: 10,
  },
  authorInfo: {
    fontSize: 16,
    color: "#fff",
  },
  bookConditionContainer: {
    marginBottom: 10,
  },
  bookConditionInfo: {
    fontSize: 16,
    color: "#fff",
  },
  genreContainer: {
    marginBottom: 10,
  },
  genreInfo: {

    fontSize: 16,
    color: "#fff",
  },
  bookPreviewContainer: {
    marginBottom: 10,
  },
  synopsisHeading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: 'center',
    marginTop: 40,
  },
  bookPreviewInfo: {
    fontSize: 16,
    color: "#fff",
    textAlign: "justify",
    padding: 10,
    lineHeight: 22,
  },
  userContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 50,
    marginBottom: 10,
  },
  userInfo: {
    fontSize: 16,
    color: "#fff",
  },
  userProfilePicture: {
    borderColor: 'white',
    height: 80,
    width: 80,
    borderRadius: 100,
    borderWidth: 2,
  },
  bookRatingContainer: {
    marginBottom: 10,
  },
  bookRatingInfo: {
    fontSize: 16,
    color: "#fff",
  },
});

export default SingleBookPage;

