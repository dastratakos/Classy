import { Pressable, StyleSheet, ScrollView } from "react-native";
import { Text, View } from "./Themed";
import { getTimeString, termIdToFullName } from "../utils";

import AppStyles from "../styles/AppStyles";
import Button from "./Buttons/Button";
import Colors from "../constants/Colors";
import { Enrollment } from "../types";
import Layout from "../constants/Layout";
import Modal from "react-native-modal";
import { getCourse } from "../services/courses";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import { FlatList } from "react-native-gesture-handler";

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
    <Modal isVisible={visible}>
      <Pressable style={styles.container} onPress={() => setVisible(false)}>
        <Pressable
          style={[
            styles.modalView,
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

          {enrollment.schedules.length > 5 ? (
            <FlatList
              data={enrollment.schedules}
              style={{ height: 100 }}
              renderItem={({ item }) => (
                <Text style={styles.schedText}>
                  {item.days.join(", ")}{" "}
                  {/* TODO: AFRICA IS BECAUSE OF TIMEZONE ERROR IN FIRESTORE DATABASE */}
                  {getTimeString(item.startInfo, "Africa/Casablanca")} -{" "}
                  {getTimeString(item.endInfo, "America/Danmarkshavn")}
                </Text>
              )}
            />
          ) : (
            <View style={styles.classTimesWrap}>
              {enrollment.schedules.map((schedule, i) => (
                <Text style={styles.schedText}>
                  {schedule.days.join(", ")}{" "}
                  {/* TODO: AFRICA IS BECAUSE OF TIMEZONE ERROR IN FIRESTORE DATABASE */}
                  {getTimeString(schedule.startInfo, "Africa/Casablanca")} -{" "}
                  {getTimeString(schedule.endInfo, "America/Danmarkshavn")}
                </Text>
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
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  modalView: {
    ...AppStyles.boxShadow,
    borderRadius: Layout.radius.large,
    padding: Layout.spacing.large,
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
    height: 200,
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
