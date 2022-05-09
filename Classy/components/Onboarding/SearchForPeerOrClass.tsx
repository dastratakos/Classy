import { Image, StyleSheet } from "react-native";
import { Text, View } from "../Themed";
import Layout from "../../constants/Layout";

export default function SearchForPeerOrClass() {
  return (
    <View style={styles.screenContainer}>
      <Image
        source={require("../../assets/images/onboarding/onboarding3.png")}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>Search for any peer or class</Text>
        <Text style={styles.body}>
          Discover classes that your peers have taken, and meet students with
          similar classes or interests.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    width: Layout.window.width,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: Layout.window.width,
    width: Layout.window.width,
    resizeMode: "contain",
  },
  textContainer: {
    alignItems: "center",
    width: "80%",
    marginTop: Layout.spacing.xlarge,
  },
  title: {
    fontSize: Layout.text.xxlarge,
    fontWeight: "500",
    marginBottom: Layout.spacing.medium,
    textAlign: "center",
  },
  body: {
    fontSize: Layout.text.large,
    textAlign: "center",
  },
});
