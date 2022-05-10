import { ScrollView, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import { useContext, useEffect, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { getCurrentTermId, termIdToFullName } from "../utils";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import { getEnrollmentsForTerm } from "../services/enrollments";
import { Enrollment } from "../types";

export default function Home() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  useEffect(() => {
    const loadScreen = async () => {
      setEnrollments(
        await getEnrollmentsForTerm(context.user.id, getCurrentTermId())
      );
    };
    loadScreen();
  }, []);

  return (
    <ScrollView
      style={{ backgroundColor: Colors[colorScheme].background }}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <Text style={styles.title}>{termIdToFullName(getCurrentTermId())}</Text>
      <View style={AppStyles.section}>
        <Text>TODO: HomeCards with enrollments data</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: Layout.spacing.xlarge,
    fontSize: Layout.text.xlarge,
  },
});
