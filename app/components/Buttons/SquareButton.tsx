import { StyleSheet, TouchableOpacity } from "react-native";

import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import { Text, View } from "../Themed";

export default function SquareButton({
  num,
  text,
}: {
  num: number;
  text: string;
}) {
  return (
    <TouchableOpacity
      onPress={() => console.log("SquareButton pressed")}
      style={styles.container}
    >
      <Text style={styles.number}>{num}</Text>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
    borderWidth: 1,
    borderColor: Colors.light.border, // TODO: useThemeColor
    height: 60,
    width: 60,
    borderRadius: Layout.radius.small,
  },
  number: {
    fontSize: Layout.text.large
  },
});
