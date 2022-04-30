import { Text, View } from "../components/Themed";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import { ScrollView, StyleSheet } from "react-native";
import { useContext, useEffect, useState } from "react";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import Layout from "../constants/Layout";
import { AddEditCourseProps } from "../types";

export default function AddEditCourse({ route }: AddEditCourseProps) {
  const context = useContext(AppContext);
  const colorScheme = useColorScheme();

  return (
    <ScrollView
      style={{ backgroundColor: Colors[colorScheme].background }}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={AppStyles.section}>
        <Text>CourseId: {route.params.id}</Text>
        <Text>TODO: Add/Edit course functionality</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
