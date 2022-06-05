import { StyleSheet } from "react-native";
import { Text, View } from "../Themed";
import Layout from "../../constants/Layout";
import { ReactNode } from "react";

export default function OnboardingInfo({
  title,
  body,
  image,
}: {
  title: string;
  body: string;
  image: ReactNode;
}) {
  return (
    <View style={styles.screenContainer}>
      {/* <View style={{  }}> */}
        {image}
      {/* </View> */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
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
