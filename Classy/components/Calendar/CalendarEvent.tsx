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
import { mix_hexes } from "../../utils/hexColorMixer";
import useColorScheme from "../../hooks/useColorScheme";

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
          {height > 20 && (
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
            </View>
          )}
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
    minHeight: 15,
  },
  background: {
    borderRadius: Layout.radius.xsmall,
    opacity: 0.6,
    minHeight: 15 - 1,
  },
  pressable: {
    position: "absolute",
    overflow: "hidden",
    top: 1,
    left: 1,
    padding: Layout.spacing.xxsmall,
    borderRadius: Layout.radius.xsmall,
    borderWidth: 0.5,
    minHeight: 15 - 1,
    borderLeftWidth: Layout.spacing.xxsmall,
  },
  textContainer: {
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
