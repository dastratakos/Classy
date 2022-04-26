import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "./Themed";

import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import Navigation from "../navigation";
import SquareButton from "./Buttons/SquareButton";
import { useNavigation } from "@react-navigation/core";
import useColorScheme from "../hooks/useColorScheme";
import { Course } from "../types";

export default function CourseCard({
  course,
  numFriends,
  emphasize,
}: {
  course: Course;
  numFriends: string;
  emphasize: boolean;
}) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Course", { course })}
      style={[styles.container, { borderColor: Colors[colorScheme].border }]}
    >
      <View style={styles.textContainer}>
        <Text style={styles.code}>
          {course.code}
          {emphasize ? " ⭐️" : null}
        </Text>
        <Text style={styles.title}>{course.title}</Text>
        <Text style={styles.units}>
          {course.unitsMin}
          {course.unitsMin === course.unitsMax
            ? ""
            : `-${course.unitsMax}`}{" "}
          units
        </Text>
      </View>
      <SquareButton
        num={numFriends}
        text={"friend" + (numFriends !== "1" ? "s" : "")}
        onPress={() => console.log("Square button pressed")}
        pressable={false}
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
    width: "100%",
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
