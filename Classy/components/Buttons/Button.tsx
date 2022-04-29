import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../Themed";

import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import useColorScheme from "../../hooks/useColorScheme";

export default function Button({
  text,
  onPress,
  pressable = true,
}: {
  text: string;
  onPress: () => void;
  pressable?: boolean;
}) {
  const colorScheme = useColorScheme();

  if (!pressable)
    return (
      <View
        style={[styles.container, { borderColor: Colors[colorScheme].border }]}
      >
        <Text>{text}</Text>
      </View>
    );

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
    padding: Layout.spacing.small,
    borderWidth: 1,
    borderRadius: Layout.radius.small,
  },
});
