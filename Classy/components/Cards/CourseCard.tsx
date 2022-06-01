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
  emphasize = false,
  rightElement,
  onPress = () => {},
  searchTerm,
}: {
  course: Course;
  emphasize?: boolean;
  rightElement?: JSX.Element;
  onPress?: () => void;
  searchTerm?: string;
}) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  let codesList: string[] = course.code;

  if (searchTerm) {
    // if no space, add in for code matching
    if (!searchTerm.includes(" ")) {
      const numIndex = searchTerm.search(/[^A-Za-z]/);
      if (numIndex > 0)
        searchTerm =
          searchTerm.substring(0, numIndex) +
          " " +
          searchTerm.substring(numIndex);
    }
    searchTerm = searchTerm.toUpperCase();

    let matchingCodes = [];
    let otherCodes = [];
    for (let code of course.code) {
      if (code.startsWith(searchTerm)) matchingCodes.push(code);
      else otherCodes.push(code);
    }
    codesList = [...matchingCodes, ...otherCodes];
  }

  return (
    <View
      style={[
        styles.container,
        AppStyles.boxShadow,
        { backgroundColor: Colors[colorScheme].cardBackground },
      ]}
    >
      <TouchableOpacity
        onPress={() => {
          onPress();
          navigation.navigate("Course", { course });
        }}
        style={styles.innerContainer}
      >
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {codesList.join(", ")}
            {emphasize ? " ⭐️" : null}
          </Text>
          <Text style={styles.cardSubtitle} numberOfLines={1}>
            {course.title}
          </Text>
        </View>
        {rightElement}
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
  numberText: {
    fontSize: Layout.text.xlarge,
  },
  friendsText: {
    fontSize: Layout.text.medium,
  },
});
