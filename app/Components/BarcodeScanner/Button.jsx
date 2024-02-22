import React from "react";
import {
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  Text,
  Alert,
} from "react-native";

const Separator = () => <View style={styles.separator} />;

const ScanButton = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Press button to scan Barcode</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Scan"
          onPress={() => {navigation.navigate("BarCodeScan")}}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginVertical: 150,
  },
  buttonContainer: {
    marginVertical: 10,
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: "#737373",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default ScanButton;
