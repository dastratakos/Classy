import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "./Themed";

import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
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
    <View style={[styles.container, styles.boxShadow]}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Course", { id: course.courseId })}
        style={styles.innerContainer}
      >
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>
            {course.code}
            {emphasize ? " ⭐️" : null}
          </Text>
          <Text style={styles.cardSubtitle} numberOfLines={1}>
            {course.title}
          </Text>
        </View>
        <View style={styles.numFriendsContainer}>
          <Text style={styles.numberText}>{numFriends}</Text>
          <Text style={styles.friendsText}>
            {"friend" + (numFriends !== "1" ? "s" : "")}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Layout.spacing.medium,
    paddingVertical: Layout.spacing.small,
    borderRadius: Layout.radius.medium,
    marginVertical: Layout.spacing.small,
    width: "100%",
  },
  boxShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  textContainer: {
    flex: 1,
    backgroundColor: "transparent"
  },
  cardTitle: {
    fontSize: Layout.text.xlarge,
    // fontWeight: "500",
  },
  cardSubtitle: {
    fontSize: Layout.text.medium,
  },
  numFriendsContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: Layout.photo.small,
    width: Layout.photo.small,
    borderRadius: Layout.radius.small,
    marginLeft: Layout.spacing.small,
    backgroundColor: "transparent"
  },
  numberText: {
    fontSize: Layout.text.xlarge,
  },
  friendsText: {
    fontSize: Layout.text.medium,
  }
});
