import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../Themed";

import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import useColorScheme from "../../hooks/useColorScheme";

export default function SquareButton({
  num,
  text,
  onPress,
}: {
  num: string;
  text: string;
  onPress: () => void;
}) {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, { borderColor: Colors[colorScheme].border }]}
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
    padding: Layout.spacing.xxsmall,
    borderWidth: 1,
    height: 70,
    width: 70,
    borderRadius: Layout.radius.small,
  },
  number: {
    fontSize: Layout.text.large,
  },
  text: {
    fontSize: Layout.text.medium,
  },
});
