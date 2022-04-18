import { ScrollView, StyleSheet } from "react-native";

import Colors from "../constants/Colors";
import CourseCard from "../components/CourseCard";
import { FontAwesome } from "@expo/vector-icons";
import Layout from "../constants/Layout";
import { View } from "../components/Themed";
import WideButton from "../components/Buttons/WideButton";

const courses = [
  {
    code: "CS 194W",
    title: "Senior Project (WIM)",
    numUnits: "3",
    numFriends: "9",
  },
  {
    code: "CS 224U",
    title: "Natural Language Understanding",
    numUnits: "4",
    numFriends: "13",
  },
  {
    code: "CS 224U",
    title: "Seminar on AI Safety",
    numUnits: "1",
    numFriends: "1",
  },
  {
    code: "ME 104B",
    title: "Designing Your Life",
    numUnits: "2",
    numFriends: "4",
  },
  {
    code: "PSYC 135",
    title: "Dement's Sleep and Dreams",
    numUnits: "3",
    numFriends: "27",
  },
];

export default function Courses() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={styles.section}>
        {courses.map((course, i) => (
          <CourseCard
            code={course.code}
            title={course.title}
            numUnits={course.numUnits}
            numFriends={course.numFriends}
          />
        ))}
      </View>
      <View style={styles.section}>
        <WideButton text={"View All Quarters"} onPress={() => {}}></WideButton>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
  },
  section: {
    width: "100%",
    padding: Layout.spacing.medium,
  },
  photo: {
    backgroundColor: Colors.imagePlaceholder,
    height: Layout.image.medium,
    width: Layout.image.medium,
    borderRadius: Layout.image.medium / 2,
    marginRight: Layout.spacing.large,
  },
  name: {
    fontSize: Layout.text.xlarge,
  },
  status: {
    height: 10,
    width: 10,
    borderRadius: 10 / 2,
    backgroundColor: Colors.status.inClass,
  },
  statusText: {
    color: Colors.light.secondaryText,
    marginLeft: Layout.spacing.small,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    width: 30,
    marginRight: 15,
    alignItems: "center",
  },
  separator: {
    marginVertical: 10,
    height: 2,
    borderRadius: 1,
    width: "80%",
  },
  day: {
    alignItems: "center",
    justifyContent: "center",
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
    borderWidth: 1,
  },
  daySelected: {
    color: "#fff",
    backgroundColor: "red",
  },
});
