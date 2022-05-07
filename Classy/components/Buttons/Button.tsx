import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../Themed";

import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import useColorScheme from "../../hooks/useColorScheme";
import AppStyles from "../../styles/AppStyles";

export default function Button({
  text,
  onPress,
  disabled = false,
  loading = false,
  emphasized = false,
}: {
  text: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  emphasized?: boolean;
}) {
  const colorScheme = useColorScheme();

  if (disabled)
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: Colors[colorScheme].tertiaryBackground },
        ]}
      >
        <Text style={{ color: Colors[colorScheme].secondaryText }}>{text}</Text>
      </View>
    );

  if (loading)
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: Colors[colorScheme].secondaryBackground },
        ]}
      >
        <ActivityIndicator />
      </View>
    );

  if (emphasized)
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: Colors[colorScheme].tint },
        ]}
      >
        <TouchableOpacity onPress={onPress} style={styles.innerContainer}>
          <Text style={{ color: Colors[colorScheme].background }}>{text}</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].cardBackground },
      ]}
    >
      <TouchableOpacity onPress={onPress} style={styles.innerContainer}>
        <Text>{text}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...AppStyles.boxShadow,
    height: Layout.buttonHeight.medium,
    borderRadius: Layout.radius.medium,
    alignItems: "center",
    justifyContent: "center",
  },
  innerContainer: {
    height: Layout.buttonHeight.medium,
    width: "100%",
    borderRadius: Layout.radius.medium,
    padding: Layout.spacing.small,
    alignItems: "center",
    justifyContent: "center",
  },
});
