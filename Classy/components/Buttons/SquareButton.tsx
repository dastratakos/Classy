import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../Themed";

import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import useColorScheme from "../../hooks/useColorScheme";
import AppStyles from "../../styles/AppStyles";

export default function SquareButton({
  num,
  text,
  onPress,
  pressable = true,
}: {
  num: string;
  text: string;
  onPress: () => void;
  pressable?: boolean;
}) {
  const colorScheme = useColorScheme();

  if (!pressable)
    return (
      <View style={styles.container}>
        <Text style={styles.number}>{num}</Text>
        <Text style={styles.text}>{text}</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress} style={styles.innerContainer}>
        <Text style={styles.number}>{num}</Text>
        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...AppStyles.boxShadow,
    padding: Layout.spacing.xxsmall,
    height: 70,
    width: 70,
    borderRadius: Layout.radius.small,
    justifyContent: "center",
  },
  innerContainer: {
    alignItems: "center",
  },
  number: {
    fontSize: Layout.text.large,
  },
  text: {
    fontSize: Layout.text.medium,
  },
});
