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
import { FIREBASE_AUTH, FIREBASE_DB } from "../../FireBaseConfig";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { AntDesign } from "@expo/vector-icons";

const SingleBookPage = ({ navigation, route }) => {
  const [data, setData] = useState([]);
  const [currUser, setCurrUser] = useState(FIREBASE_AUTH.currentUser);

  const routeIdentifier = route.params.id;
  const useruid = route.params.uid;

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

  const favBook = async () => {
    const bookRef = doc(FIREBASE_DB, "books", `${routeIdentifier}`);

    await updateDoc(bookRef, {
      favouritedBy: arrayUnion(currUser.uid),
    });

    fetchDataFromFirestore();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
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

          if (loc.image === undefined) {
            loc.image = "no image available";
          }

          if (loc.id === routeIdentifier) {
            return (
              <View key={loc.id} style={styles.pageContainer}>
                <View style={styles.headingContainer}>
                  <Text style={styles.heading}>{loc.bookTitle}</Text>
                </View>

                <View style={styles.topSection}>
                  <View style={styles.bookImageContainer}>
                    <Image
                      source={{ uri: loc.image }}
                      style={styles.bookImage}
                    ></Image>
                  </View>
                  <View style={styles.topSectionText}>
                    <View style={styles.bookAuthorContainer}>
                      {loc.favouritedBy.includes(currUser.uid) ? (
                        <AntDesign
                          style={{ textAlign: "center", paddingBottom: 5 }}
                          name="heart"
                          size={24}
                          color="red"
                        />
                      ) : (
                        <AntDesign
                          style={{ textAlign: "center", paddingBottom: 5 }}
                          name="heart"
                          size={24}
                          color="white"
                        />
                      )}
                    </View>
                  </View>

                  <Text style={styles.authorName}>By {loc.bookAuthor}</Text>
                </View>

                <View style={styles.orderAndChatContainer}>
                  <Button title="Favourite" onPress={() => favBook()} />
                  <Button
                    title="Chat now"
                    // onPress={navigation.navigate("Chat", {
                    //   userID: useruid,
                    // })}
                    onPress={() =>
                      navigation.navigate("Chat", {
                        uid: useruid,
                        name: loc.user,
                      })
                    }
                    // onPress={() => console.log(useruid)}
                  />
                </View>

                <View style={styles.bookPreviewContainer}>
                  <Text style={styles.synopsisHeading}>Synopsis</Text>
                  <Text style={styles.bookPreviewInfo}>{loc.bookPreview}</Text>
                </View>

                <View style={styles.bookInfoContainer}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.titleInfo}>Title: {loc.bookTitle}</Text>
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

                <View style={styles.userContainer}>
                  <Text style={styles.userInfo}>User: {loc.user}</Text>
                  <Image
                    source={require("../../Images/fantasyHat.png")}
                    style={styles.userProfilePicture}
                  ></Image>
                </View>

                {/* <View>
                  <Text>Comments:</Text>
                  <Text>
                    User bugsBunny5: What's up, doc? .This Book is so funny, i
                    especially like it when the duck gets roasted extra crispy
                  </Text>
                  <Text>
                    User daffyD69: We've all got a mission in life; we get into
                    different ruts. Some are the cogs on the wheels; others are
                    just plain nuts, just like this book!
                  </Text>
                  <Text>
                    User BigElmsFudd: Be vewy, vewy qwiet when reading this
                    book.
                  </Text>
                  <Text>
                    User YosemiteSamTheMighty: This book is a dog-blasted,
                    ornery, no-account, long-eared varmint!!
                  </Text>
                  <Text>
                    User PorkyPigInBlankets: Th-Th-The, Th-Th-The, Th-Th...
                    That's all, folks!
                  </Text>
                </View> */}
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
    marginTop: 0,
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
  },
  topSection: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: 50,
  },
  bookImageContainer: {
    height: 200,
    width: 130,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  bookImage: {
    height: "100%",
    width: "100%",
    borderRadius: 10,
  },
  authorName: {
    color: "white",
    fontSize: 25,
    textAlign: "center",
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
  orderAndChatContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderTopColor: "#fff",
    borderBottomColor: "#fff",
    borderRightColor: "#00592e",
    borderLeftColor: "#00592e",
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderLeftWidth: 5,
    borderWidth: 5,
    paddingTop: 20,
    paddingBottom: 20,
    paddingRight: 20,
    paddingLeft: 20,
  },
  bookPreviewContainer: {
    marginBottom: 10,
  },
  synopsisHeading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginTop: 40,
  },
  bookInfoContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderTopColor: "#fff",
    borderBottomColor: "#fff",
    borderRightColor: "#00592e",
    borderLeftColor: "#00592e",
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderLeftWidth: 5,
    borderWidth: 5,
    marginTop: 50,
    marginBottom: 80,
    paddingTop: 20,
    paddingBottom: 10,
  },
  bookPreviewInfo: {
    fontSize: 16,
    color: "#fff",
    textAlign: "justify",
    padding: 10,
    lineHeight: 22,
  },
  userContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: 50,
    marginBottom: 10,
  },
  userInfo: {
    fontSize: 16,
    color: "#fff",
  },
  userProfilePicture: {
    borderColor: "white",
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
  spacerImageContainer: {
    borderColor: "white",
    borderWidth: 2,
    height: "50%",
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SingleBookPage;
