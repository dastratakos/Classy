import * as Haptics from "expo-haptics";

import { ActivityIndicator, Text, View } from "../components/Themed";
import { Course, EditCourseProps, Schedule } from "../types";
import { ScrollView, StyleSheet } from "react-native";
import { termIdToName } from "../utils";
import { useContext, useEffect, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import ScheduleCard from "../components/Cards/ScheduleCard";
import SquareButton from "../components/Buttons/SquareButton";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import { getCourse, getCourseTerms } from "../services/courses";
import { updateEnrollment } from "../services/enrollments";

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
              key={`${i}`}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setSaveDisabled(false);
                handleScheduleSelected(i);
              }}
              selected={selectedScheduleIndices.has(i)}
            />
          )
        )}
      </View>
    );
  };

  const handleSavePressed = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setSaveLoading(true);

    /* Build schedulesList. */
    let schedulesList: Schedule[] = [];
    selectedScheduleIndices.forEach((i) =>
      schedulesList.push(terms[`${context.selectedTerm}`][i])
    );

    await updateEnrollment(
      enrollment,
      grading,
      schedulesList,
      context.selectedTerm,
      selectedUnits,
      context.user.id
    );

    setSaveLoading(false);
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
                    (grad, i) => (
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
    fontSize: Layout.text.xxlarge,
    fontWeight: "500",
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