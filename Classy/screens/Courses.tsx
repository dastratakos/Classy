import { ScrollView, StyleSheet } from "react-native";

import Colors from "../constants/Colors";
import CourseCard from "../components/CourseCard";
import Layout from "../constants/Layout";
import { Text, View } from "../components/Themed";
import WideButton from "../components/Buttons/WideButton";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import AppStyles from "../styles/AppStyles";
import { useContext, useEffect, useState } from "react";
import AppContext from "../context/Context";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { CoursesProps } from "../types";
import CourseList from "../components/CourseList";
import { termIdToFullName } from "../utils";

export default function Courses({ route }: CoursesProps) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getCoursesForTerm(context.user.id, route.params.termId);
  }, []);

  const getCoursesForTerm = async (id: string, termId: string) => {
    // TODO: use id to query for specific courses
    const q = query(
      collection(db, "enrollments"),
      where("userId", "==", id),
      where("termId", "==", termId)
    );

    const results = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      results.push(doc.data());
    });
    setCourses(results);
  };

  return (
    <>
      <ScrollView
        style={{ backgroundColor: Colors[colorScheme].background }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <Text style={styles.title}>
          {termIdToFullName(route.params.termId)}
        </Text>
        <View style={AppStyles.section}>
          <CourseList courses={courses} />
        </View>
      </ScrollView>
      <View style={styles.ctaContainer}>
        <WideButton
          text={"View All Quarters"}
          onPress={() => navigation.navigate("MyQuarters")}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: Layout.spacing.xlarge,
    fontSize: Layout.text.xlarge,
  },
  ctaContainer: {
    ...AppStyles.row,
    position: "absolute",
    bottom: Layout.spacing.medium,
    left: Layout.spacing.medium,
    right: Layout.spacing.medium,
    backgroundColor: "transparent",
  },
});
