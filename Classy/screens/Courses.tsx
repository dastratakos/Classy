import { ScrollView, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import Colors from "../constants/Colors";
import CourseList from "../components/CourseList";
import { CoursesProps } from "../types";
import Layout from "../constants/Layout";
import { db } from "../firebase";
import { termIdToFullName } from "../utils";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function Courses({ route }: CoursesProps) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getCoursesForTerm(context.user.id, route.params.termId);
  }, []);

  const getCoursesForTerm = async (id: string, termId: string) => {
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
        <Button
          text={"View All Quarters"}
          onPress={() => navigation.navigate("MyQuarters")}
          wide
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
