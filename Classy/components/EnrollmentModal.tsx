import { FlatList, Pressable, StyleSheet } from "react-native";
import { Icon, Text, View } from "./Themed";
import { getTimeString, termIdToFullName } from "../utils";

import AppStyles from "../styles/AppStyles";
import Button from "./Buttons/Button";
import Colors from "../constants/Colors";
import { Enrollment, Schedule } from "../types";
import Layout from "../constants/Layout";
import Modal from "react-native-modal";
import { getCourse } from "../services/courses";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import { useEffect, useState } from "react";

export default function EnrollmentModal({
  enrollment,
  deleteFunc,
  visible,
  setVisible,
  editable,
}: {
  enrollment: Enrollment;
  deleteFunc: () => void;
  visible: boolean;
  setVisible: (arg0: boolean) => void;
  editable: boolean;
}) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    /* Filter for bad schedules. */
    let schedules = enrollment.schedules;
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
    setSchedules(schedules);
  }, []);

  const onEdit = () => {
    setVisible(false);
    navigation.navigate("EditCourse", { enrollment });
  };

  const onViewMore = async () => {
    setVisible(false);
    const course = await getCourse(enrollment.courseId);
    navigation.navigate("Course", { course });
  };

  return (
    <Modal isVisible={visible} onBackdropPress={() => setVisible(false)}>
      <View
        style={[
          styles.container,
          { backgroundColor: Colors[colorScheme].cardBackground },
        ]}
      >
        <Text style={styles.codes}>{enrollment.code.join(", ")}</Text>
        <Text
          style={[
            styles.title,
            {
              color: Colors[colorScheme].secondaryText,
            },
          ]}
        >
          {enrollment.title}
        </Text>
        <View style={styles.textwrap}>
          <Text style={styles.descrip}>Quarter: </Text>
          <Text style={[styles.descrip, { fontWeight: "500" }]}>
            {termIdToFullName(enrollment.termId)}
          </Text>
        </View>
        <View style={styles.textwrap}>
          <Text style={styles.descrip}>Units: </Text>
          <Text style={[styles.descrip, { fontWeight: "500" }]}>
            {enrollment.units}
          </Text>
        </View>
        <View style={styles.textwrap}>
          <Text style={styles.descrip}>Class Times: </Text>
        </View>

        {schedules.length > 5 ? (
          <FlatList
            data={schedules}
            style={{ width: "100%", maxHeight: 200 }}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.schedText}>
                  {item.days.map((day) => day.substring(0, 3)).join(", ")}
                </Text>
                <Text style={styles.schedText}>
                  {getTimeString(item.startInfo)} -{" "}
                  {getTimeString(item.endInfo)}
                </Text>
              </View>
            )}
          />
        ) : (
          <View style={styles.classTimesWrap}>
            {schedules.map((schedule, i) => (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
                key={i}
              >
                <Text style={styles.schedText}>
                  {schedule.days.map((day) => day.substring(0, 3)).join(", ")}
                </Text>
                <Text style={styles.schedText}>
                  {getTimeString(schedule.startInfo)} -{" "}
                  {getTimeString(schedule.endInfo)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {editable ? (
          <View style={styles.buttonwrap}>
            <View style={styles.buttonbox}>
              <Button text="Edit" onPress={onEdit} emphasized />
            </View>
            <View
              style={[
                styles.buttonbox,
                { paddingHorizontal: Layout.spacing.small },
              ]}
            >
              <Button
                text="View More"
                onPress={onViewMore}
                containerStyle={{
                  backgroundColor: Colors[colorScheme].background,
                }}
              />
            </View>
            <View style={styles.buttonbox}>
              <Button
                text="Delete"
                onPress={deleteFunc}
                containerStyle={{ backgroundColor: Colors.pink }}
                textStyle={{ color: Colors.white }}
              />
            </View>
          </View>
        ) : (
          <View style={styles.wideButtonWrap}>
            <Button wide emphasized text="View More" onPress={onViewMore} />
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    ...AppStyles.boxShadow,
    borderRadius: Layout.radius.large,
    padding: Layout.spacing.large,
    alignItems: "flex-start",
  },
  titleRow: {
    ...AppStyles.row,
    backgroundColor: "transparent",
    alignItems: "flex-start",
  },
  codes: {
    fontSize: Layout.text.xxlarge,
    fontWeight: "500",
  },
  title: {
    fontSize: Layout.text.xlarge,
    marginBottom: Layout.spacing.medium,
  },
  textwrap: {
    flexDirection: "row",
    backgroundColor: "transparent",
  },
  descrip: {
    fontSize: Layout.text.large,
  },
  classTimesWrap: {
    width: "100%",
    backgroundColor: "transparent",
  },
  schedText: {
    fontSize: Layout.text.large,
    fontWeight: "500",
  },
  buttonwrap: {
    flexDirection: "row",
    marginTop: Layout.spacing.medium,
    width: "100%",
    backgroundColor: "transparent",
  },
  buttonbox: {
    flex: 1,
    backgroundColor: "transparent",
  },
  wideButtonWrap: {
    paddingTop: Layout.spacing.medium,
    width: "100%",
    backgroundColor: "transparent",
  },
});
