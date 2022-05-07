import { ActivityIndicator, Text, View } from "../components/Themed";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import { ScrollView, StyleSheet } from "react-native";
import { useContext, useEffect, useState } from "react";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import Layout from "../constants/Layout";
import { AddEditCourseProps } from "../types";
import { collection, doc, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";
import { termIdToName } from "../utils";

export default function AddEditCourse({ route }: AddEditCourseProps) {
  const context = useContext(AppContext);
  const colorScheme = useColorScheme();

  const course = route.params.course;

  const [terms, setTerms] = useState({});
  const [loading, setLoading] = useState(true);

  const [selectedTerm, setSelectedTerm] = useState(null);

  useEffect(() => {
    const getTerms = async () => {
      const q = query(
        collection(doc(db, "courses", `${course.courseId}`), "terms")
      );

      const res = {};
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        res[`${doc.id}`] = doc.data();
      });
      // console.log("terms:", res);
      setTerms({ ...res });
      setLoading(false);
    };

    getTerms();
  }, []);

  const getTermNames = (terms) => {
    let ret = "";
    for (let t of Object.keys(terms)) {
      ret = `${termIdToName(t)}\n` + ret;
    }

    return ret;
  };

  if (loading) return <ActivityIndicator />;

  return (
    <ScrollView
      style={{ backgroundColor: Colors[colorScheme].background }}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={AppStyles.section}>
        <Text style={styles.title}>{course.code.join(", ")}</Text>
        <Text style={styles.title}>{course.title}</Text>
        <Text>{getTermNames(terms)}</Text>
        <Text>CourseId: {course.courseId}</Text>
        <Text>TODO: Add/Edit course functionality</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: Layout.text.xlarge,
    fontWeight: "500",
    marginBottom: Layout.spacing.small,
  },
});
