import { Alert, Pressable, StyleSheet } from "react-native";
import React, { useContext, useState } from "react";
import { Text, View } from "./Themed";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import EnrollmentModal from "./EnrollmentModal";
import { Event } from "../types";
import Layout from "../constants/Layout";
import { deleteEnrollment } from "../services/enrollments";
import { getTimeString } from "../utils";

export default function CalendarEvent({
  event,
  marginTop,
  height,
  leftIndent = 0,
}: {
  event: Event;
  marginTop: number;
  height: number;
  leftIndent: number;
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
    <View style={[styles.container, { marginTop: marginTop }]}>
      <EnrollmentModal
        enrollment={event.enrollment}
        deleteFunc={deleteEnrollmentAlert}
        visible={modalVisible}
        setVisible={setModalVisible}
        editable={event.enrollment.userId === context.user.id}
      />
      <Pressable
        style={[
          styles.event,
          {
            height,
            backgroundColor: event.enrollment.color || Colors.pink,
            marginLeft: 45 + leftIndent,
          },
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.titleText}>{event.title}</Text>
        <Text style={styles.timeText}>
          {getTimeString(event.startInfo)} - {getTimeString(event.endInfo)}
        </Text>
        <Text style={styles.locationText}>{event.location}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...AppStyles.row,
    position: "absolute",
    backgroundColor: "transparent",
  },
  event: {
    paddingVertical: Layout.spacing.xxsmall,
    paddingHorizontal: Layout.spacing.small,
    flex: 1,
    borderRadius: Layout.radius.xsmall,
    overflow: "hidden",
    opacity: 0.9,
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
