import { Image, StyleSheet } from "react-native";
import { Text, View } from "../Themed";
import Layout from "../../constants/Layout";

export default function PlanClasses() {
  return (
    <View style={styles.screenContainer}>
      <Image
        source={require("../../assets/images/onboarding/onboarding1.png")}
        style={styles.image}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>Plan classes</Text>
        <Text style={styles.body}>
          Add your classes to Classy and see your day at a glance.
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
