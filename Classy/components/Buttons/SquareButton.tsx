import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../Themed";

import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import useColorScheme from "../../hooks/useColorScheme";
import AppStyles from "../../styles/AppStyles";

export default function SquareButton({
  num,
  text,
  size = Layout.spacing.large,
  onPress,
  emphasized = false,
  pressable = true,
}: {
  num?: string;
  text?: string;
  size?: number;
  onPress?: () => void;
  emphasized?: boolean;
  pressable?: boolean;
}) {
  const colorScheme = useColorScheme();

  if (!pressable)
    return (
      <View style={[styles.container, { height: size, width: size }]}>
        <Text style={styles.number}>{num}</Text>
        <Text style={styles.text}>{text}</Text>
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
          {num && num !== "" ? <Text style={styles.number}>{num}</Text> : null}
          {text && text !== "" ? <Text style={styles.text}>{text}</Text> : null}
        </TouchableOpacity>
      </View>
    );

  return (
    <View style={[styles.container, { height: size, width: size }]}>
      <TouchableOpacity onPress={onPress} style={styles.innerContainer}>
        {num && num !== "" ? <Text style={styles.number}>{num}</Text> : null}
        {text && text !== "" ? <Text style={styles.text}>{text}</Text> : null}
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
    justifyContent: "center",
    alignItems: "center",
  },
  number: {
    fontSize: Layout.text.large,
  },
  text: {
    fontSize: Layout.text.medium,
  },
});
