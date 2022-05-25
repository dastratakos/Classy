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
  if ( searchTerm && !searchTerm.includes(" ")) { // if no space, add in for code matching
    const numIndex = searchTerm.search(/[^A-Za-z]/);
    if (numIndex > 0) {
      searchTerm = searchTerm.substring(0, numIndex).toUpperCase() + " " + searchTerm.substring(numIndex);
    } else {
      searchTerm = searchTerm.toUpperCase();
    }
  } else if (searchTerm) {
    searchTerm = searchTerm.toUpperCase();
  }

  let codesList = [];
  if (searchTerm) {
    let placeholder = [];
    for (let i = 0; i < course.code.length; i++) {
      if(course.code[i].startsWith(searchTerm)) {
        codesList.push(course.code[i]);
      } else {
        placeholder.push(course.code[i]);
      }
    }
    codesList = codesList.concat(placeholder);
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
            {/* {course.code.join(", ")} */}
            {searchTerm ? codesList.join(", ") : course.code.join(", ")}
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
