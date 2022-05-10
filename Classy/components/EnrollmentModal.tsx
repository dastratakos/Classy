import { Modal, Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "./Themed";

import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { useNavigation } from "@react-navigation/core";
import useColorScheme from "../hooks/useColorScheme";
import { Enrollment } from "../types";
import AppStyles from "../styles/AppStyles";
import { useState } from "react";
import Button from "./Buttons/Button";
import { color } from "react-native-reanimated";
import { getTimeString, termIdToFullName } from "../utils";
import ScheduleCard from "./ScheduleCard";

export default function EnrollmentModal({
  enrollment,
  deleteFunc,
  visible,
  setVisible,
  editable = true,
}: {
  enrollment: Enrollment;
  deleteFunc: () => void;
  visible: boolean;
  setVisible: (arg0: boolean) => void;
  editable?: boolean;
}) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const onEdit = () => {
    console.log("on edit");
  }

  const onViewMore = () => {
    console.log("on view more");
  }

  const onDelete = () => {
    console.log("on delete");
  }

  const deleteContainerStyle = {
    backgroundColor: Colors.pink
  }
  const deleteTextStyle = {
    color: Colors.white
  }
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => setVisible(!visible)}
    >
      <Pressable
        style={[
          styles.container,
          { backgroundColor: Colors[colorScheme].overlay },
        ]}
        onPress={() => setVisible(false)}
      >
        <Pressable
          style={[
            styles.modalView,
            { backgroundColor: Colors[colorScheme].cardBackground },
          ]}
        >
          <Text style={styles.codes}>{enrollment.code[0]}</Text>
          <Text style={[styles.title, {
            color: Colors[colorScheme].secondaryText
          }]}>{enrollment.title}</Text>
          <View style={styles.textwrap}>
            <Text style={styles.descrip}>Units: </Text>
            <Text style={[styles.descrip, {fontWeight: "500"}]}>{enrollment.units}</Text>
          </View>
          <View style={styles.textwrap}>
            <Text style={styles.descrip}>Quarter: </Text>
            <Text style={[styles.descrip, {fontWeight: "500"}]}>{termIdToFullName(enrollment.termId)}</Text>
          </View>
          <View style={styles.textwrap}>
            <Text style={styles.descrip}>Class Times: </Text>
            {/* <Text style={[styles.descrip, {fontWeight: "500"}]}>{}</Text> */}
          </View>
          <View style={styles.classTimesWrap}>
            {enrollment.schedules.map((schedule, i) => (
              <Text style={styles.schedText} >
              {schedule.days.join(", ")}{" "}
              {getTimeString(schedule.startInfo, "Africa/Casablanca")} -{" "}
              {getTimeString(schedule.endInfo, "Africa/Casablanca")}
            </Text>
            ))}
            
          </View>
          {editable ? 
            <View style={styles.buttonwrap}>
              <View style={styles.buttonbox}>
                <Button text="Edit" onPress={onEdit} emphasized/>
              </View>
              <View style={[styles.buttonbox, {paddingHorizontal: Layout.spacing.small}]}>
                <Button text="View More" onPress={onViewMore} />
              </View>
              <View style={styles.buttonbox}>
                <Button text="Delete" onPress={onDelete} containerStyle={deleteContainerStyle} textStyle={deleteTextStyle} />
              </View>
            </View>  
            : 
            <View style={styles.wideButtonWrap}>
              <Button wide emphasized text="View More" onPress={onViewMore}/>
            </View>
            
          }
          
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
    margin: Layout.spacing.large,
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
  },
  descrip: {
    fontSize: Layout.text.large,
  },
  classTimesWrap: {
    width: "100%",
  },
  schedText: {
    fontSize: Layout.text.large,
    fontWeight: "500",
  },
  buttonwrap: {
    flexDirection: "row",
    marginTop: Layout.spacing.medium,
    width: "100%",
  },
  buttonbox: {
    flex: 1,
  },
  wideButtonWrap: {
    paddingTop: Layout.spacing.medium,
    width: "100%",
  }
});
