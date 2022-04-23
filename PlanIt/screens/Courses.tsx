import { ScrollView, StyleSheet } from "react-native";

import Colors from "../constants/Colors";
import CourseCard from "../components/CourseCard";
import Layout from "../constants/Layout";
import { View } from "../components/Themed";
import WideButton from "../components/Buttons/WideButton";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

const courses = [
  {
    code: "CS 194W",
    title: "Senior Project (WIM)",
    units: "3",
    numFriends: "9",
    taking: true,
  },
  {
    code: "CS 224U",
    title: "Natural Language Understanding",
    units: "4",
    numFriends: "13",
    taking: true,
  },
  {
    code: "CS 224U",
    title: "Seminar on AI Safety",
    units: "1",
    numFriends: "1",
    taking: true,
  },
  {
    code: "ME 104B",
    title: "Designing Your Life",
    units: "2",
    numFriends: "4",
    taking: true,
  },
  {
    code: "PSYC 135",
    title: "Dement's Sleep and Dreams",
    units: "3",
    numFriends: "27",
    taking: true,
  },
];

export default function Courses() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  return (
    <ScrollView
      style={{ backgroundColor: Colors[colorScheme].background }}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={styles.section}>
        {courses.map((course, i) => (
          <CourseCard
            code={course.code}
            title={course.title}
            units={course.units}
            numFriends={course.numFriends}
            emphasize={course.taking}
            key={i}
          />
        ))}
      </View>
      <View style={styles.section}>
        <WideButton
          text={"View All Quarters"}
          onPress={() => navigation.navigate("Quarters")}
        ></WideButton>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    width: "100%",
    padding: Layout.spacing.medium,
  },
});
