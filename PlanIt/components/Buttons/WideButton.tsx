import { StyleSheet, TouchableOpacity } from "react-native";

import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import { Text, View } from "../Themed";

export default function WideButton({
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
    alignItems: "center",
    padding: 3,
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.light.border, // TODO: useThemeColor
    borderRadius: Layout.radius.small,
  },
});
