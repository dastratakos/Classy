import { Text, View } from "../components/Themed";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import { ScrollView, StyleSheet } from "react-native";
import { useContext, useEffect, useState } from "react";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import Layout from "../constants/Layout";
import { CourseSimilarityProps } from "../types";

export default function CourseSimilarity({ route }: CourseSimilarityProps) {
  const context = useContext(AppContext);
  const colorScheme = useColorScheme();

  return (
    <ScrollView
      style={{ backgroundColor: Colors[colorScheme].background }}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={AppStyles.section}>
        <Text>Friend id: {route.params.id}</Text>
        <Text>TODO: Course Similarity screen</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
