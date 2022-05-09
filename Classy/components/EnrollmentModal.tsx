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

export default function EnrollmentModal({
  enrollment,
  deleteFunc,
  visible,
  setVisible,
}: {
  enrollment: Enrollment;
  deleteFunc: () => void;
  visible: boolean;
  setVisible: (arg0: boolean) => void;
}) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

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
          <Text>{enrollment.title}</Text>
          <Text>TODO: Enrollment modal</Text>
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
    alignItems: "center",
  },
});
