import * as Haptics from "expo-haptics";

import { ActivityIndicator, Text, View } from "../components/Themed";
import { Course, EditCourseProps, Enrollment, Schedule } from "../types";
import { Alert, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { getCourse, getCourseTerms } from "../services/courses";
import { useContext, useEffect, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import ScheduleCard from "../components/Cards/ScheduleCard";
import SquareButton from "../components/Buttons/SquareButton";
import { getTimeString, termIdToFullName, termIdToName } from "../utils";
import { updateEnrollment } from "../services/enrollments";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import { getNumFriendsInCourse } from "../services/friends";

export default function EditCourse({ route }: EditCourseProps) {
  const context = useContext(AppContext);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const enrollment = route.params.enrollment;

  const [course, setCourse] = useState<Course>({} as Course);
  const [terms, setTerms] = useState({});
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUnits, setSelectedUnits] = useState<number>(enrollment.units);
  const [grading, setGrading] = useState<string>(enrollment.grading);
  const [selectedScheduleIndices, setSelectedScheduleIndices] = useState<
    Set<number>
  >(new Set<number>());

  const [saveLoading, setSaveLoading] = useState(false);
  const [saveDisabled, setSaveDisabled] = useState(true);

  useEffect(() => {
    const loadScreen = async () => {
      context.setSelectedColor(enrollment.color || Colors.pink);

      const course = await getCourse(enrollment.courseId);
      setCourse(course);

      const res = await getCourseTerms(course.courseId);
      setTerms({ ...res });

      context.setSelectedTerm(enrollment.termId);

      let selectedSectionNumbers = new Set<string>();
      enrollment.schedules.forEach((schedule: Schedule, i: number) => {
        selectedSectionNumbers.add(schedule.sectionNumber);
      });

      let newSet = new Set<number>();
      res[`${enrollment.termId}`].forEach((schedule: Schedule, i: number) => {
        if (selectedSectionNumbers.has(schedule.sectionNumber)) newSet.add(i);
      });
      setSelectedScheduleIndices(newSet);

      setLoading(false);
    };

    loadScreen();
  }, []);

  const duplicateCourseAlert = () =>
    Alert.alert(
      "Oops!",
      `You are already enrolled in this course for ${termIdToFullName(
        context.selectedTerm
      )}.`,
      [{ text: "OK" }]
    );

  const handleSavePressed = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setSaveLoading(true);

    if (
      enrollment.termId !== context.selectedTerm &&
      context.enrollments.filter(
        (enrollment: Enrollment) =>
          enrollment.courseId === course.courseId &&
          enrollment.termId === context.selectedTerm
      ).length > 0
    ) {
      setSaveLoading(false);
      duplicateCourseAlert();
      return;
    }

    /* Build schedulesList. */
    let schedulesList: Schedule[] = [];
    selectedScheduleIndices.forEach((i) =>
      schedulesList.push(terms[`${context.selectedTerm}`][i])
    );

    await updateEnrollment(
      enrollment,
      context.selectedColor || Colors.pink,
      grading,
      schedulesList,
      context.selectedTerm,
      selectedUnits,
      context.user.id
    );

    const data: Enrollment = {
      ...enrollment,
      color: context.selectedColor,
      grading,
      schedules: schedulesList,
      termId: context.selectedTerm,
      units: selectedUnits,
      numFriends:
        context.selectedTerm === enrollment.termId
          ? enrollment.numFriends
          : await getNumFriendsInCourse(
              course.courseId,
              context.friendIds,
              context.selectedTerm
            ),
    };

    let newEnrollments = context.enrollments.filter(
      (e: Enrollment) =>
        e.courseId !== enrollment.courseId || e.termId !== enrollment.termId
    );
    newEnrollments.push(data);
    newEnrollments.sort((a: Enrollment, b: Enrollment) =>
      a.code > b.code ? 1 : -1
    );
    context.setEnrollments([...newEnrollments]);

    setSaveLoading(false);
    navigation.goBack();
  };
  const Schedules = () => {
    if (context.selectedTerm === "") return null;

    const handleScheduleSelected = (i: number) => {
      let newSet = new Set(selectedScheduleIndices);
      if (newSet.has(i)) newSet.delete(i);
      else newSet.add(i);

      setSelectedScheduleIndices(newSet);
    };

    let schedules = terms[`${context.selectedTerm}`];
    for (let j = 0; j < schedules.length; j++) {
      const sched = schedules[j];
      if (
        sched["days"].length === 0 ||
        getTimeString(sched["startInfo"]) === "12:00 AM" ||
        getTimeString(sched["startInfo"]) === "" ||
        getTimeString(sched["endInfo"]) === "12:00 AM" ||
        getTimeString(sched["endInfo"]) === ""
      ) {
        schedules.splice(j, 1);
        j--;
      }
    }

    return (
      <View
        style={{
          marginBottom: Layout.buttonHeight.medium + Layout.spacing.medium,
        }}
      >
        {terms[`${context.selectedTerm}`].map(
          (schedule: Schedule, i: number) => (
            <View key={i.toString()}>
              <ScheduleCard
                schedule={schedule}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setSaveDisabled(false);
                  handleScheduleSelected(i);
                }}
                selected={selectedScheduleIndices.has(i)}
              />
            </View>
          )
        )}
      </View>
    );
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
          <Text
            style={[styles.title, { color: Colors[colorScheme].secondaryText }]}
          >
            {course.title}
          </Text>
          <View style={styles.row}>
            <Text style={styles.subheading}>Color</Text>
            <TouchableOpacity
              style={[
                styles.colorPicker,
                { backgroundColor: context.selectedColor },
              ]}
              onPress={() => {
                setSaveDisabled(false);
                navigation.navigate("SelectColor");
              }}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.subheading}>Quarter</Text>
            <Button
              text={
                context.selectedTerm !== ""
                  ? termIdToName(context.selectedTerm)
                  : "Select"
              }
              onPress={() => {
                setSaveDisabled(false);
                navigation.navigate("SelectQuarter", {
                  terms: Object.keys(terms),
                });
              }}
              emphasized={context.selectedTerm !== ""}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.subheading}>Units</Text>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "flex-end",
                width: "75%",
              }}
            >
              {Array.from(
                { length: course.unitsMax - course.unitsMin + 1 },
                (_, i) => i + course.unitsMin
              ).map((numUnits) => (
                <View
                  style={{
                    marginLeft: Layout.spacing.small,
                    marginVertical: Layout.spacing.xsmall,
                  }}
                  key={numUnits}
                >
                  <SquareButton
                    num=""
                    text={`${numUnits}`}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      setSaveDisabled(false);
                      setSelectedUnits(numUnits);
                    }}
                    size={Layout.buttonHeight.medium}
                    emphasized={selectedUnits === numUnits}
                  />
                </View>
              ))}
            </View>
          </View>

          <View style={styles.gradingBasisWrap}>
            <Text style={styles.subheading}>Grading basis</Text>
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
                    (grad: string, i: number) => (
                      <View key={i.toString()}>
                        <Button
                          text={grad}
                          onPress={() => {
                            Haptics.impactAsync(
                              Haptics.ImpactFeedbackStyle.Medium
                            );
                            setSaveDisabled(false);
                            setGrading(grad);
                          }}
                          emphasized={grading === grad}
                        />
                      </View>
                    )
                  )}
                </>
              ) : null}
            </View>
          </View>
          <View>
            <Text style={styles.subheading}>Class times</Text>
            <Text style={{ color: Colors[colorScheme].secondaryText }}>
              Select your lecture and section, if applicable
            </Text>
            <Schedules />
          </View>
        </View>
      </ScrollView>
      <View style={styles.ctaContainer}>
        <View style={{ width: "48%", backgroundColor: "transparent" }}>
          <Button
            text="Cancel"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              navigation.goBack();
            }}
          />
        </View>
        <View style={{ width: "48%", backgroundColor: "transparent" }}>
          <Button
            text="Save changes"
            onPress={handleSavePressed}
            disabled={saveDisabled}
            loading={saveLoading}
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
  subheading: {
    fontSize: Layout.text.large,
  },
  colorPicker: {
    ...AppStyles.boxShadow,
    height: Layout.buttonHeight.medium,
    width: 2 * Layout.buttonHeight.medium,
    borderRadius: Layout.radius.medium,
  },
  gradingBasisWrap: {
    marginVertical: Layout.spacing.medium,
  },
});
