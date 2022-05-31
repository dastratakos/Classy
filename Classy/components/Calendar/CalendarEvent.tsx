import { Alert, Pressable, StyleSheet } from "react-native";
import React, { useContext, useState } from "react";
import { Text, View } from "./../Themed";

import AppContext from "../../context/Context";
import AppStyles from "../../styles/AppStyles";
import Colors from "../../constants/Colors";
import EnrollmentModal from "./../EnrollmentModal";
import { Event } from "../../types";
import Layout from "../../constants/Layout";
import { deleteEnrollment } from "../../services/enrollments";
import { getTimeString } from "../../utils";

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

  const [modalVisible, setModalVisible] = useState(false);

  const handleDeleteEnrollment = async () => {
    setModalVisible(false);
    await deleteEnrollment(event.enrollment);
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
      <View style={[{ height, width, top, left }, styles.container]}>
        <Pressable
          style={[
            {
              ...styles.event,
              height: height - 1,
              width: width - 1,
              backgroundColor: event.enrollment.color || Colors.pink,
              borderColor: event.enrollment.color || Colors.pink,
            },
          ]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.titleText} numberOfLines={2}>
            {event.title}
          </Text>
          <Text style={styles.timeText}>
            {getTimeString(event.startInfo)} - {getTimeString(event.endInfo)}
          </Text>
          <Text style={styles.locationText}>{event.location}</Text>
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
    minHeight: 20,
  },
  event: {
    paddingVertical: Layout.spacing.xxsmall,
    paddingRight: Layout.spacing.small,
    paddingLeft: Layout.spacing.small - Layout.spacing.xsmall,
    borderRadius: Layout.radius.xsmall,
    borderLeftWidth: Layout.spacing.xxsmall,
    opacity: 0.9,
    minHeight: 20 - 1,
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
