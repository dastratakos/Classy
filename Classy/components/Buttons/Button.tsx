import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../Themed";

import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import useColorScheme from "../../hooks/useColorScheme";
import AppStyles from "../../styles/AppStyles";

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
      <View style={styles.container}>
        <Text>{text}</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.innerContainer}>
        <Text>{text}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...AppStyles.boxShadow,
    padding: Layout.spacing.small,
    borderRadius: Layout.radius.small,
  },
  innerContainer: {
    alignItems: "center"
  }
});
