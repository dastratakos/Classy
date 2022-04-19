import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "./Themed";

import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import Navigation from "../navigation";
import SquareButton from "./Buttons/SquareButton";
import { useNavigation } from "@react-navigation/core";

export default function CourseCard({
  code,
  title,
  units,
  numFriends,
}: {
  code: string;
  title: string;
  units: string;
  numFriends: string;
}) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Course")}
      style={styles.container}
    >
      <View style={styles.textContainer}>
        <Text style={styles.code}>{code}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.units}>{units} units</Text>
      </View>
      <SquareButton
        num={numFriends}
        text={"friend" + (numFriends !== "1" ? "s" : "")}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: Layout.spacing.medium,
    borderRadius: Layout.radius.medium,
    borderWidth: 1,
    marginVertical: Layout.spacing.small,
  },
  textContainer: {
    justifyContent: "space-between",
  },
  code: {
    fontSize: Layout.text.large,
    fontWeight: "500",
  },
  title: {
    fontSize: Layout.text.medium,
  },
  units: {
    // TODO: change font color
  },
});
