import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../Themed";

import Layout from "../../constants/Layout";
import AppStyles from "../../styles/AppStyles";

export default function QuarterButton({
  num,
  text,
  onPress,
  color,
  textColor,
}: {
  num: string;
  text: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  emphasized?: boolean;
  color?: Object;
  textColor?: Object;
}) {
  return (
    <View style={[styles.container, color]}>
      <TouchableOpacity onPress={onPress} style={styles.innerContainer}>
        <Text style={[styles.text, textColor]}>{text}</Text>
        <View style={styles.unitContainer}>
          <Text style={[styles.number, textColor]}>{num}</Text>
          <Text style={[styles.unitsText, textColor]}>Units</Text>
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
    backgroundColor: "transparent",
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
