import { ScrollView, StyleSheet } from "react-native";
import { ActivityIndicator, Text, View } from "../components/Themed";

import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import { CourseSimilarityProps, Enrollment } from "../types";
import EmptyList from "../components/EmptyList";
import EnrollmentList from "../components/Lists/EnrollmentList";
import Layout from "../constants/Layout";
import ProgressBar from "../components/ProgressBar";
import SVGEmpty from "../assets/images/undraw/empty.svg";
import useColorScheme from "../hooks/useColorScheme";
import { useContext, useEffect, useState } from "react";
import { getNumFriendsInCourse } from "../services/friends";
import AppContext from "../context/Context";
import { getCurrentTermId } from "../utils";

export default function CourseSimilarity({ route }: CourseSimilarityProps) {
  const context = useContext(AppContext);
  const colorScheme = useColorScheme();

  const [overlap, setOverlap] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadScreen = async () => {
      let enrollments = route.params.overlap;
      for (let i = 0; i < enrollments.length; i++) {
        const enrollment = enrollments[i];
        if (enrollment.numFriends !== -1) continue;

        enrollments[i].numFriends = await getNumFriendsInCourse(
          enrollment.courseId,
          context.friendIds,
          getCurrentTermId()
        );
      }
      setOverlap(enrollments);

      setLoading(false);
    };
    loadScreen();
  }, []);

  if (loading) return <ActivityIndicator />;

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
        {overlap.length > 0 && (
          <Text style={styles.title}>Overlapping courses</Text>
        )}
        <EnrollmentList
          enrollments={overlap}
          editable={false}
          emphasized
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
