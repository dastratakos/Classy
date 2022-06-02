import { ActivityIndicator, Text, View } from "../components/Themed";
import { Enrollment, EnrollmentsProps, User } from "../types";
import { ScrollView, StyleSheet } from "react-native";
import { termIdToFullName, termIdToQuarterName } from "../utils";
import { useContext, useEffect, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import Colors from "../constants/Colors";
import EmptyList from "../components/EmptyList";
import EnrollmentList from "../components/Lists/EnrollmentList";
import Layout from "../constants/Layout";
import SVGAutumn from "../assets/images/undraw/autumn.svg";
import SVGNoCourses from "../assets/images/undraw/noCourses.svg";
import SVGSpring from "../assets/images/undraw/spring.svg";
import SVGSummer from "../assets/images/undraw/summer.svg";
import SVGWinter from "../assets/images/undraw/winter.svg";
import { getEnrollmentsForTerm } from "../services/enrollments";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function Enrollments({ route }: EnrollmentsProps) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const quarterName = termIdToQuarterName(route.params.termId);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadScreen = async () => {
      if (route.params.userId === context.user.id) {
        setEnrollments(
          context.enrollments.filter(
            (enrollment: Enrollment) =>
              enrollment.termId === route.params.termId
          )
        );
      } else {
        setEnrollments(
          await getEnrollmentsForTerm(
            context.friendIds,
            route.params.userId,
            route.params.termId
          )
        );
      }

      setLoading(false);
    };
    loadScreen();
  }, []);

  return (
    <>
      <ScrollView
        style={{ backgroundColor: Colors[colorScheme].background }}
        contentContainerStyle={{
          alignItems: "center",
          paddingBottom: Layout.buttonHeight.medium + Layout.spacing.medium,
        }}
      >
        <Text style={styles.title}>
          {termIdToFullName(route.params.termId)}
        </Text>
        <View style={AppStyles.section}>
          {loading ? (
            <ActivityIndicator />
          ) : (
            <EnrollmentList
              enrollments={enrollments}
              emptyElement={
                <EmptyList
                  SVGElement={
                    quarterName === "Aut"
                      ? SVGAutumn
                      : quarterName === "Win"
                      ? SVGWinter
                      : quarterName === "Spr"
                      ? SVGSpring
                      : quarterName === "Sum"
                      ? SVGSummer
                      : SVGNoCourses
                  }
                  primaryText="No courses this quarter"
                  secondaryText={
                    context.user.id == route.params.userId
                      ? "Add some from the search tab, or explore your friends' courses!"
                      : ""
                  }
                />
              }
            />
          )}
        </View>
      </ScrollView>
      <View style={styles.ctaContainer}>
        <Button
          text={"View All Quarters"}
          onPress={() => navigation.goBack()}
          wide
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: Layout.spacing.xlarge,
    fontSize: Layout.text.xlarge,
  },
  ctaContainer: {
    ...AppStyles.row,
    position: "absolute",
    bottom: Layout.spacing.medium,
    left: Layout.spacing.medium,
    right: Layout.spacing.medium,
    backgroundColor: "transparent",
  },
});
