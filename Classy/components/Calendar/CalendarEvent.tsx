import { Alert, Pressable, StyleSheet } from "react-native";
import React, { useContext, useState } from "react";
import { Text, View } from "./../Themed";

import AppContext from "../../context/Context";
import Colors from "../../constants/Colors";
import EnrollmentModal from "./../EnrollmentModal";
import { Enrollment, Event } from "../../types";
import Layout from "../../constants/Layout";
import { deleteEnrollment } from "../../services/enrollments";
import { mix_hexes } from "../../utils/hexColorMixer";
import useColorScheme from "../../hooks/useColorScheme";

const EVENT_MIN_HEIGHT = 25;

export default function CalendarEvent({
  event,
  height,
  width,
  top,
  left,
}: {
  event: Event;
  height: number;
  width: number;
  top: number;
  left: number;
}) {
  const context = useContext(AppContext);
  const colorScheme = useColorScheme();

  const color = event.enrollment.color || Colors.pink;
  const [modalVisible, setModalVisible] = useState(false);

  const handleDeleteEnrollment = async () => {
    setModalVisible(false);
    await deleteEnrollment(event.enrollment);

    let newEnrollments = context.enrollments.filter(
      (enrollment: Enrollment) =>
        enrollment.courseId !== event.enrollment.courseId &&
        enrollment.termId !== event.enrollment.termId
    );
    context.setEnrollments(newEnrollments);
  };

  const deleteEnrollmentAlert = () => {
    Alert.alert("Delete course", `Are you sure?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: handleDeleteEnrollment,
      },
    ]);
  };

  return (
    <>
      <EnrollmentModal
        enrollment={event.enrollment}
        deleteFunc={deleteEnrollmentAlert}
        visible={modalVisible}
        setVisible={setModalVisible}
        editable={event.enrollment.userId === context.user.id}
      />
      <View style={{ ...styles.container, height, width, top, left }}>
        <View
          style={{
            ...styles.background,
            height: height - 1,
            width: width - 1,
            backgroundColor: color,
          }}
        />
        <Pressable
          style={{
            ...styles.pressable,
            height: height - 1,
            width: width - 1,
            borderColor: color,
          }}
          onPress={() => setModalVisible(true)}
        >
          <View
            style={{
              ...styles.textContainer,
              height: height - 1 - 2 * Layout.spacing.xxsmall,
            }}
          >
            <Text
              style={[
                styles.titleText,
                {
                  color: mix_hexes(
                    color.substring(0, 7),
                    Colors[colorScheme].text
                  ),
                },
              ]}
              numberOfLines={1}
            >
              {event.title}
            </Text>
            {height > EVENT_MIN_HEIGHT && (
              <Text
                style={[
                  styles.locationText,
                  {
                    color: mix_hexes(
                      color.substring(0, 7),
                      Colors[colorScheme].text
                    ),
                  },
                ]}
                numberOfLines={2}
              >
                {event.location}
              </Text>
            )}
          </View>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    overflow: "hidden",
    padding: 0.5,
    backgroundColor: "transparent",
    minHeight: EVENT_MIN_HEIGHT,
  },
  background: {
    borderRadius: Layout.radius.xsmall,
    opacity: 0.6,
    minHeight: EVENT_MIN_HEIGHT - 1,
  },
  pressable: {
    position: "absolute",
    overflow: "hidden",
    top: 1,
    left: 1,
    padding: Layout.spacing.xxsmall,
    borderRadius: Layout.radius.xsmall,
    borderWidth: 0.5,
    minHeight: EVENT_MIN_HEIGHT - 1,
    borderLeftWidth: Layout.spacing.xxsmall,
  },
  textContainer: {
    minHeight: EVENT_MIN_HEIGHT - 2 - 2 * Layout.spacing.xxsmall,
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  titleText: {
    fontWeight: "500",
    color: Colors.black,
  },
  timeText: {
    fontSize: Layout.text.small,
    color: Colors.black,
  },
  locationText: {
    fontSize: Layout.text.small,
    fontStyle: "italic",
    color: Colors.black,
  },
});
