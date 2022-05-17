import { StyleSheet, TouchableOpacity } from "react-native";
import { ActivityIndicator, Text, View } from "../Themed";

import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import useColorScheme from "../../hooks/useColorScheme";
import AppStyles from "../../styles/AppStyles";

export default function QuarterButton({
  num,
  text,
  onPress,
  disabled = false,
  loading = false,
  emphasized = false,
  color,
}: {
  num: string;
  text: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  emphasized?: boolean;
  color?: Object;
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
        <Text style={styles.text}>{text}</Text>
        <View
          style={styles.unitContainer}
        >
          <Text style={styles.number}>{num}</Text>
          <Text style={styles.unitsText}>Units</Text>
        </View>
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
          <Text
            style={[styles.text, { color: Colors[colorScheme].background }]}
          >
            {text}
          </Text>
          <View
            style={styles.unitContainer}
          >
            <Text
              style={[styles.number, { color: Colors[colorScheme].background }]}
            >
              {num}
            </Text>
            <Text style={styles.unitsText}>Units</Text>
          </View>
        </TouchableOpacity>
      </View>
    );

  return (
    <View style={[styles.container, color]}>
      <TouchableOpacity onPress={onPress} style={styles.innerContainer}>
        <Text style={styles.text}>{text}</Text>
        <View
          style={styles.unitContainer}
        >
          <Text style={styles.number}>{num}</Text>
          <Text style={styles.unitsText}>Units</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...AppStyles.boxShadow,
    borderRadius: Layout.radius.medium,
    justifyContent: "center",
  },
  innerContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    borderRadius: Layout.radius.medium,
    justifyContent: "space-around",
    alignItems: "center",
    padding: Layout.spacing.small,
  },
  unitContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "transparent"
  },
  number: {
    fontSize: Layout.text.xlarge,
  },
  unitsText: {
    fontSize: Layout.text.small,
  },
  text: {
    fontSize: Layout.text.medium,
  },
});
