import { StyleSheet, TouchableOpacity } from "react-native";

import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import { Text, View } from "../Themed";

export default function Button({ text }: { text: string }) {
  return (
    <TouchableOpacity
      onPress={() => console.log("Button pressed")}
      style={styles.container}
    >
      <Text>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    // alignSelf: "flex-start",
    alignItems: "center",
    padding: 3,
    borderWidth: 1,
    borderColor: Colors.light.border, // TODO: useThemeColor
    borderRadius: Layout.radius.small,
  },
});
