import { ScrollView, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import { useContext, useEffect, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import Colors from "../constants/Colors";
import { Enrollment, EnrollmentsProps, User } from "../types";
import Layout from "../constants/Layout";
import { termIdToFullName } from "../utils";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import { getEnrollmentsForTerm } from "../services/enrollments";
import EnrollmentList from "../components/Lists/EnrollmentList";

export default function Enrollments({ route }: EnrollmentsProps) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  const context = useContext(AppContext);

  const myEnrollment = context.user.id == route.params.userId;

  useEffect(() => {
    const loadScreen = async () => {
      setEnrollments(
        await getEnrollmentsForTerm(route.params.userId, route.params.termId)
      );
    };
    loadScreen();
  }, []);

  return (
    <>
      <ScrollView
        style={{ backgroundColor: Colors[colorScheme].background }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <Text style={styles.title}>
          {termIdToFullName(route.params.termId)}
        </Text>
        <View style={AppStyles.section}>
          <EnrollmentList enrollments={enrollments} emptyPrimary="No courses" emptySecondary={myEnrollment ? "Add some from the search tab, or explore your friends' courses!" : ""}/>
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