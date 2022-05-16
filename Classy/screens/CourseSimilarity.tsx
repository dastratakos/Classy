import { ScrollView, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";

import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import { CourseSimilarityProps } from "../types";
import EmptyList from "../components/EmptyList";
import EnrollmentList from "../components/Lists/EnrollmentList";
import Layout from "../constants/Layout";
import ProgressBar from "../components/ProgressBar";
import SVGEmpty from "../assets/images/undraw/empty.svg";
import useColorScheme from "../hooks/useColorScheme";

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
        {route.params.overlap.length > 0 && (
          <Text style={styles.title}>Overlapping courses</Text>
        )}
        <EnrollmentList
          enrollments={route.params.overlap}
          emptyElement={
            <EmptyList
              SVGElement={SVGEmpty}
              primaryText="No overlapping courses"
            />
          }
        />
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
