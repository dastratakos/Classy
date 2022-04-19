import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../Themed";

import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";

export default function Button({
  text,
  onPress,
}: {
  text: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    // alignSelf: "flex-start",
    alignItems: "center",
    padding: Layout.spacing.xxsmall,
    borderWidth: 1,
    borderColor: Colors.light.border, // TODO: useThemeColor
    borderRadius: Layout.radius.small,
  },
});
