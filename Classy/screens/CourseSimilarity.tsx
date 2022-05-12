import { Text, View } from "../components/Themed";

import AppStyles from "../styles/AppStyles";
import { ScrollView, StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import Layout from "../constants/Layout";
import { CourseSimilarityProps } from "../types";
import EnrollmentList from "../components/Lists/EnrollmentList";
import ProgressBar from "../components/ProgressBar";

export default function CourseSimilarity({ route }: CourseSimilarityProps) {
  const colorScheme = useColorScheme();

  return (
    <ScrollView
      style={{ backgroundColor: Colors[colorScheme].background }}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={AppStyles.section}>
        <ProgressBar
          progress={route.params.courseSimilarity}
          text={`${Math.round(
            route.params.courseSimilarity
          )}% course similarity`}
          containerStyle={{ marginVertical: Layout.spacing.medium }}
        />
        <Text style={styles.title}>Overlapping courses</Text>
        <EnrollmentList enrollments={route.params.overlap} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: Layout.text.xxlarge,
    fontWeight: "500",
  },
});
