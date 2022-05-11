import { Text, View } from "../components/Themed";

import AppStyles from "../styles/AppStyles";
import { ScrollView, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import Layout from "../constants/Layout";
import { CourseSimilarityProps } from "../types";
import EnrollmentList from "../components/Lists/EnrollmentList";

export default function CourseSimilarity({ route }: CourseSimilarityProps) {
  const colorScheme = useColorScheme();

  return (
    <ScrollView
      style={{ backgroundColor: Colors[colorScheme].background }}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={AppStyles.section}>
        <Text style={styles.similarity}>
          Course similarity: {Math.round(route.params.courseSimilarity)}%
        </Text>
        <Text style={styles.title}>Overlapping courses</Text>
        <EnrollmentList enrollments={route.params.overlap} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  similarity: {
    marginBottom: Layout.spacing.large,
  },
  title: {
    fontSize: Layout.text.xxlarge,
    fontWeight: "500",
  },
});
