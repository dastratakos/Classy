import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../Themed";

import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import useColorScheme from "../../hooks/useColorScheme";

export default function WideButton({
  text,
  onPress,
}: {
  text: string;
  onPress: () => void;
}) {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, { borderColor: Colors[colorScheme].border }]}
    >
      <Text>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: Layout.spacing.xxsmall,
    width: "100%",
    borderWidth: 1,
    borderRadius: Layout.radius.small,
  },
});
