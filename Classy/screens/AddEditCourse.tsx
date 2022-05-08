import * as Haptics from "expo-haptics";

import { ActivityIndicator, Text, View } from "../components/Themed";
import { AddEditCourseProps, Schedule } from "../types";
import { ScrollView, StyleSheet } from "react-native";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  increment,
  query,
  updateDoc,
} from "firebase/firestore";
import { getCurrentTermId, termIdToName, termIdToYear } from "../utils";
import { useContext, useEffect, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import ScheduleCard from "../components/ScheduleCard";
import SquareButton from "../components/Buttons/SquareButton";
import { db } from "../firebase";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function AddEditCourse({ route }: AddEditCourseProps) {
  const context = useContext(AppContext);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const course = route.params.course;

  const [terms, setTerms] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedUnits, setSelectedUnits] = useState(course.unitsMin);
  const [grading, setGrading] = useState(
    context.selectedTerm && terms[`${context.selectedTerm}`]
      ? terms[`${context.selectedTerm}`][0].grading[0]
      : ""
  );
  const [selectedScheduleIndices, setSelectedScheduleIndices] = useState(
    new Set<number>()
  );

  const [doneLoading, setDoneLoading] = useState(false);

  useEffect(() => {
    const getTerms = async () => {
      const q = query(
        collection(doc(db, "courses", `${course.courseId}`), "terms")
      );

      const res = {};
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        let resSchedules = doc.data().schedules;
        resSchedules.sort(
          (a: Schedule, b: Schedule) => a.sectionNumber > b.sectionNumber
        );
        let resStudents = doc.data().students;

        res[`${doc.id}`] = resSchedules;
      });
      setTerms({ ...res });

      const currentTermId = getCurrentTermId();
      if (currentTermId in res) {
        context.setSelectedTerm(currentTermId);
        if (terms[`${context.selectedTerm}`])
          setGrading(terms[`${context.selectedTerm}`][0].grading[0]);
      } else {
        context.setSelectedTerm("");
      }

      setLoading(false);
    };

    getTerms();
  }, []);

  const Schedules = () => {
    if (context.selectedTerm === "") return null;

    const handleScheduleSelected = (i: number) => {
      let newSet = new Set(selectedScheduleIndices);
      if (newSet.has(i)) newSet.delete(i);
      else newSet.add(i);

      setSelectedScheduleIndices(newSet);
    };

    return (
      <View
        style={{
          marginBottom: Layout.buttonHeight.medium + Layout.spacing.medium,
        }}
      >
        {terms[`${context.selectedTerm}`].map(
          (schedule: Schedule, i: number) => (
            <ScheduleCard
              schedule={schedule}
              key={i}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                handleScheduleSelected(i);
              }}
              emphasized={selectedScheduleIndices.has(i)}
            />
          )
        )}
      </View>
    );
  };

  const addEnrollmentDB = async () => {
    // TODO: error handling

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setDoneLoading(true);

    let schedulesList: Schedule[] = [];
    selectedScheduleIndices.forEach((i) =>
      schedulesList.push(terms[`${context.selectedTerm}`][i])
    );

    /* 1. Create doc in enrollments collection. */
    const data = {
      code: course.code,
      courseId: course.courseId,
      grading: grading,
      schedules: schedulesList,
      termId: context.selectedTerm,
      title: course.title,
      units: selectedUnits,
      userId: context.user.id,
    };

    await addDoc(collection(db, "enrollments"), data);

    /* 2. Update number of units in user doc in users collection. */
    // TODO: need to check if that field exists in the user terms?
    const year = termIdToYear(context.selectedTerm);
    const termKey = `terms.${year}.${context.selectedTerm}`;
    let userData = {};
    userData[termKey] = increment(selectedUnits);

    await updateDoc(doc(db, "users", context.user.id), userData);

    /* 3. Updates students list for that term in courses collection. */
    const studentsKey = `students.${context.user.id}`;
    let courseData = {};
    courseData[studentsKey] = true;
    await updateDoc(
      doc(
        doc(db, "courses", `${course.courseId}`),
        "terms",
        context.selectedTerm
      ),
      courseData
    );

    setDoneLoading(false);
    navigation.goBack();
  };

  if (loading) return <ActivityIndicator />;

  return (
    <>
      <ScrollView
        style={{ backgroundColor: Colors[colorScheme].background }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <View style={AppStyles.section}>
          <Text style={styles.title}>{course.code.join(", ")}</Text>
          <Text style={styles.title}>{course.title}</Text>
          <View style={styles.row}>
            <Text>Quarter</Text>
            <Button
              text={
                context.selectedTerm !== ""
                  ? termIdToName(context.selectedTerm)
                  : "Select"
              }
              onPress={() =>
                navigation.navigate("SelectQuarter", {
                  terms: Object.keys(terms),
                })
              }
              emphasized={context.selectedTerm !== ""}
            />
          </View>
          <View style={styles.row}>
            <Text>Units</Text>
            <View style={{ flexDirection: "row" }}>
              {Array.from(
                { length: course.unitsMax - course.unitsMin + 1 },
                (_, i) => i + course.unitsMin
              ).map((numUnits) => (
                <View
                  style={{ marginLeft: Layout.spacing.small }}
                  key={numUnits}
                >
                  <SquareButton
                    num=""
                    text={`${numUnits}`}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      setSelectedUnits(numUnits);
                    }}
                    size={Layout.buttonHeight.medium}
                    emphasized={selectedUnits === numUnits}
                  />
                </View>
              ))}
            </View>
          </View>
          <View>
            <Text>Grading basis</Text>
            <View
              style={{
                flexDirection: "row",
                marginVertical: Layout.spacing.medium,
                justifyContent: "space-evenly",
              }}
            >
              {context.selectedTerm && terms[`${context.selectedTerm}`] ? (
                <>
                  {terms[`${context.selectedTerm}`][0].grading.map(
                    (grad, i) => (
                      <Button
                        text={grad}
                        onPress={() => {
                          Haptics.impactAsync(
                            Haptics.ImpactFeedbackStyle.Medium
                          );
                          setGrading(grad);
                        }}
                        emphasized={grading === grad}
                      />
                    )
                  )}
                </>
              ) : null}
            </View>
          </View>
          <View>
            <Text>Class times</Text>
            <Schedules />
          </View>
        </View>
      </ScrollView>
      <View style={styles.ctaContainer}>
        <View style={{ width: "48%" }}>
          <Button
            text="Cancel"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              navigation.goBack();
            }}
          />
        </View>
        <View style={{ width: "48%" }}>
          <Button
            text="Done"
            onPress={addEnrollmentDB}
            disabled={
              !context.selectedTerm ||
              !selectedUnits ||
              !grading ||
              !selectedScheduleIndices.size
            }
            loading={doneLoading}
            emphasized
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: Layout.text.xlarge,
    fontWeight: "500",
    marginBottom: Layout.spacing.small,
  },
  row: {
    ...AppStyles.row,
    marginVertical: Layout.spacing.medium,
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
