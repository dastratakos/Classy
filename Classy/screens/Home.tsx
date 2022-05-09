import { ScrollView, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import Colors from "../constants/Colors";
import CourseList from "../components/CourseList";
import Layout from "../constants/Layout";
import { db } from "../firebase";
import { getCurrentTermId, termIdToFullName } from "../utils";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function Home() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    getEnrollmentsForTerm(context.user.id, getCurrentTermId());
  }, []);

  const getEnrollmentsForTerm = async (id: string, termId: string) => {
    const q = query(
      collection(db, "enrollments"),
      where("userId", "==", id),
      where("termId", "==", termId)
    );

    const results = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      results.push(doc.data());
    });
    setEnrollments(results);
  };

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
