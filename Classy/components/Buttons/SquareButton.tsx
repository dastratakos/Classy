import { StyleSheet, TouchableOpacity } from "react-native";
import { ActivityIndicator, Text, View } from "../Themed";

import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import useColorScheme from "../../hooks/useColorScheme";
import AppStyles from "../../styles/AppStyles";

export default function SquareButton({
  num,
  text,
  size = Layout.spacing.large,
  onPress,
  disabled = false,
  loading = false,
  emphasized = false,
  indicator = false,
}: {
  num?: string;
  text?: string;
  size?: number;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  emphasized?: boolean;
  indicator?: boolean;
}) {
  const colorScheme = useColorScheme();

  if (disabled)
    return (
      <View
        style={[
          styles.container,
          {
            height: size,
            width: size,
            backgroundColor: Colors[colorScheme].tertiaryBackground,
          },
        ]}
      >
        <Text style={styles.number}>{num}</Text>
        <Text style={styles.text}>{text}</Text>
        {indicator && <View style={styles.indicator} />}
      </View>
    );

  if (loading)
    return (
      <View
        style={[
          styles.container,
          {
            height: size,
            width: size,
            backgroundColor: Colors[colorScheme].secondaryBackground,
          },
        ]}
      >
        <ActivityIndicator />
        {indicator && <View style={styles.indicator} />}
      </View>
    );

  if (emphasized)
    return (
      <View
        style={[
          styles.container,
          {
            height: size,
            width: size,
            backgroundColor: Colors[colorScheme].tint,
          },
        ]}
      >
        <TouchableOpacity onPress={onPress} style={styles.innerContainer}>
          {num && num !== "" ? (
            <Text
              style={[styles.number, { color: Colors[colorScheme].background }]}
            >
              {num}
            </Text>
          ) : null}
          {text && text !== "" ? (
            <Text
              style={[styles.text, { color: Colors[colorScheme].background }]}
            >
              {text}
            </Text>
          ) : null}
        </TouchableOpacity>
        {indicator && <View style={styles.indicator} />}
      </View>
    );

  return (
    <View
      style={[
        styles.container,
        {
          height: size,
          width: size,
          backgroundColor: Colors[colorScheme].cardBackground,
        },
      ]}
    >
      <TouchableOpacity onPress={onPress} style={styles.innerContainer}>
        {num && num !== "" ? <Text style={styles.number}>{num}</Text> : null}
        {text && text !== "" ? <Text style={styles.text}>{text}</Text> : null}
      </TouchableOpacity>
      {indicator && <View style={styles.indicator} />}
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
    height: "100%",
    width: "100%",
    borderRadius: Layout.radius.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  number: {
    fontSize: Layout.text.large,
  },
  text: {
    fontSize: Layout.text.medium,
  },
  indicator: {
    height: 15,
    width: 15,
    borderRadius: 15 / 2,
    backgroundColor: Colors.pink,
    position: "absolute",
    top: -3,
    right: -3,
  },
});
