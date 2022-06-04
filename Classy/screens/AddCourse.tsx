import * as Haptics from "expo-haptics";

import { ActivityIndicator, Text, View } from "../components/Themed";
import { AddCourseProps, Enrollment, Schedule } from "../types";
import Colors, { enrollmentColors } from "../constants/Colors";
import { Alert, ScrollView, StyleSheet } from "react-native";
import {
  getCurrentTermId,
  getTimeString,
  sendPushNotification,
  termIdToFullName,
  termIdToName,
} from "../utils";
import { useContext, useEffect, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import Layout from "../constants/Layout";
import ScheduleCard from "../components/Cards/ScheduleCard";
import SquareButton from "../components/Buttons/SquareButton";
import { addEnrollment } from "../services/enrollments";
import { addNotification } from "../services/notifications";
import { getCourseTerms } from "../services/courses";
import { getFriendsInCourse, getNumFriendsInCourse } from "../services/friends";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function AddCourse({ route }: AddCourseProps) {
  const context = useContext(AppContext);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const course = route.params.course;

  const [terms, setTerms] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedUnits, setSelectedUnits] = useState(course.unitsMax);
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
    const loadScreen = async () => {
      const res = await getCourseTerms(course.courseId);
      setTerms({ ...res });

      const currentTermId = getCurrentTermId();
      if (currentTermId in res) {
        context.setSelectedTerm(currentTermId);
        if (res[`${currentTermId}`])
          setGrading(res[`${currentTermId}`][0].grading[0]);
      } else {
        context.setSelectedTerm("");
      }

      setLoading(false);
    };

    loadScreen();
  }, []);

  let schedules = terms[`${context.selectedTerm}`];

  const Schedules = () => {
    if (context.selectedTerm === "") return null;

    const handleScheduleSelected = (i: number) => {
      let newSet = new Set(selectedScheduleIndices);
      if (newSet.has(i)) newSet.delete(i);
      else newSet.add(i);

      console.log("selected schedules:", newSet);

      setSelectedScheduleIndices(newSet);
    };

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
        {schedules.map((schedule: Schedule, i: number) => (
          <View key={i.toString()}>
            <ScheduleCard
              schedule={schedule}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                handleScheduleSelected(i);
              }}
              selected={selectedScheduleIndices.has(i)}
            />
          </View>
        ))}
      </View>
    );
  };

  const duplicateCourseAlert = () =>
    Alert.alert(
      "Oops!",
      `You are already enrolled in this course for ${termIdToFullName(
        context.selectedTerm
      )}. Please choose a different quarter.`,
      [{ text: "OK" }]
    );

  const handleDonePressed = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setDoneLoading(true);

    if (
      context.enrollments.filter(
        (enrollment: Enrollment) =>
          enrollment.courseId === course.courseId &&
          enrollment.termId === context.selectedTerm
      ).length > 0
    ) {
      setDoneLoading(false);
      duplicateCourseAlert();
      return;
    }

    /* Build schedulesList. */
    let schedulesList: Schedule[] = [];
    selectedScheduleIndices.forEach((i) =>
      schedulesList.push(terms[`${context.selectedTerm}`][i])
    );

    console.log("selectedScheduleIndices:", selectedScheduleIndices);
    console.log("schedulesList:", schedulesList);

    let randomColor =
      enrollmentColors[Math.floor(Math.random() * enrollmentColors.length)];

    const docId = await addEnrollment(
      course,
      grading,
      schedulesList,
      context.selectedTerm,
      selectedUnits,
      randomColor,
      context.user
    );

    const data: Enrollment = {
      docId,
      code: course.code,
      courseId: course.courseId,
      grading,
      schedules: schedulesList,
      termId: context.selectedTerm,
      title: course.title,
      units: selectedUnits,
      color: randomColor,
      userId: context.user.id,
      numFriends:
        context.selectedTerm === getCurrentTermId()
          ? await getNumFriendsInCourse(
              course.courseId,
              context.friendIds,
              context.selectedTerm
            )
          : -1,
    };

    let newEnrollments = context.enrollments;
    newEnrollments.push(data);
    newEnrollments.sort((a: Enrollment, b: Enrollment) =>
      a.code > b.code ? 1 : -1
    );
    context.setEnrollments([...newEnrollments]);

    /* Get friends in this course. */
    const friends = await getFriendsInCourse(
      context.friendIds,
      course.courseId,
      context.selectedTerm
    );

    const quarterText =
      context.selectedTerm === getCurrentTermId()
        ? "this quarter"
        : termIdToFullName(context.selectedTerm);

    for (let friend of friends) {
      sendPushNotification(
        friend.expoPushToken,
        `${context.user.name} just enrolled in ${course.code.join(", ")}: ${
          course.title
        } for ${quarterText}`
      );

      addNotification(
        friend.id,
        "MUTUAL_ENROLLMENT",
        context.user.id,
        course.courseId,
        context.selectedTerm
      );
    }

    setDoneLoading(false);
    navigation.goBack();
    navigation.navigate("ProfileStack", { screen: "Profile" });
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
            <Text style={styles.subheading}>Quarter</Text>
            <Button
              text={
                context.selectedTerm !== ""
                  ? termIdToName(context.selectedTerm)
                  : "Select a Quarter"
              }
              onPress={() =>
                navigation.navigate("SelectQuarter", {
                  terms: Object.keys(terms),
                })
              }
              emphasized={context.selectedTerm !== ""}
              containerStyle={
                context.selectedTerm === "" && { backgroundColor: Colors.pink }
              }
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
                        key={i.toString()}
                      />
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
            text="Done"
            onPress={handleDonePressed}
            disabled={
              !context.selectedTerm ||
              !selectedUnits ||
              !grading ||
              (!selectedScheduleIndices.size && schedules.size)
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
  subheading: {
    fontSize: Layout.text.large,
  },
  gradingBasisWrap: {
    marginVertical: Layout.spacing.medium,
  },
});
