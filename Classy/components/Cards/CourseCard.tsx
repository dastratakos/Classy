import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../Themed";

import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import { useNavigation } from "@react-navigation/core";
import useColorScheme from "../../hooks/useColorScheme";
import { Course } from "../../types";
import AppStyles from "../../styles/AppStyles";

export default function CourseCard({
  course,
  numFriends = 0,
  emphasize = false,
}: {
  course: Course;
  numFriends?: number;
  emphasize?: boolean;
}) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  return (
    <View
      style={[
        styles.container,
        AppStyles.boxShadow,
        { backgroundColor: Colors[colorScheme].cardBackground },
      ]}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate("Course", { course })}
        style={styles.innerContainer}
      >
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {course.code.join(", ")}
            {emphasize ? " ⭐️" : null}
          </Text>
          <Text style={styles.cardSubtitle} numberOfLines={1}>
            {course.title}
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
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    backgroundColor: "transparent",
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
    borderRadius: Layout.radius.xsmall,
    marginLeft: Layout.spacing.small,
    backgroundColor: "transparent",
  },
  numberText: {
    fontSize: Layout.text.xlarge,
  },
  friendsText: {
    fontSize: Layout.text.medium,
  },
});
