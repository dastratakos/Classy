import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "./Themed";

import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { Event } from "../types";
import { getTimeString } from "../utils";
import React, { useContext, useState } from "react";
import EnrollmentModal from "./EnrollmentModal";
import { deleteEnrollment } from "../services/enrollments";
import AppContext from "../context/Context";

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
    console.log("handleDeleteEnrollment");
    await deleteEnrollment(event.enrollment.docId);
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
      <View style={[styles.leftPadding, { width: 45 + leftIndent }]} />
      <View style={[styles.event, { height }]}>
        <TouchableOpacity
          onPress={() => {
            console.log("opening");
            setModalVisible(true);
          }}
        >
          <Text style={styles.titleText}>{event.title}</Text>
          {/* TODO: AFRICA IS BECAUSE OF TIMEZONE ERROR IN FIRESTORE DATABASE */}
          <Text style={styles.timeText}>
            {getTimeString(event.startInfo, "Africa/Casablanca") +
              " - " +
              getTimeString(event.endInfo, "America/Danmarkshavn")}
          </Text>
          <Text style={styles.locationText}>{event.location}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...AppStyles.row,
    position: "absolute",
    backgroundColor: "transparent",
  },
  leftPadding: {
    backgroundColor: "transparent",
  },
  event: {
    paddingVertical: Layout.spacing.xxsmall,
    paddingHorizontal: Layout.spacing.small,
    flex: 1,
    borderRadius: Layout.radius.xsmall,
    backgroundColor: Colors.lightRed,
    overflow: "hidden",
    opacity: 0.9,
  },
  titleText: {
    fontWeight: "500",
  },
  timeText: {
    fontSize: Layout.text.small,
  },
  locationText: {
    fontSize: Layout.text.small,
    fontStyle: "italic",
  },
});
