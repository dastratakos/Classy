import { View, Text } from "../components/Themed";
import Layout from "../constants/Layout";
import { StyleSheet } from "react-native";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";

export default function EmptyList({
  primaryText,
  secondaryText = "",
}: {
  primaryText: string;
  secondaryText?: string;
}) {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <Text style={styles.primary}>{primaryText}</Text>
      <Text style={[styles.secondary, {color: Colors[colorScheme].secondaryText}]}>{secondaryText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  primary: {
    fontSize: Layout.text.large,
    textAlign: "center",
  },
  secondary: {
    fontSize: Layout.text.medium,
    padding: Layout.spacing.xsmall,
    textAlign: "center"
  },
});
