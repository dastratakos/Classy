import { ActivityIndicator, Text, View } from "../components/Themed";
import { ScrollView, StyleSheet } from "react-native";
import { collection, doc, getDocs, query } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";

import { AddEditCourseProps } from "../types";
import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import SquareButton from "../components/Buttons/SquareButton";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { db } from "../firebase";
import { getCurrentTermId, termIdToName } from "../utils";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function AddEditCourse({ route }: AddEditCourseProps) {
  const context = useContext(AppContext);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const course = route.params.course;

  const [terms, setTerms] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedUnits, setSelectedUnits] = useState(course.unitsMin);

  useEffect(() => {
    const getTerms = async () => {
      const q = query(
        collection(doc(db, "courses", `${course.courseId}`), "terms")
      );

      const res = {};
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        res[`${doc.id}`] = doc.data();
      });
      console.log("terms:", res);
      setTerms({ ...res });

      const currentTermId = getCurrentTermId();
      if (currentTermId in res) {
        context.setSelectedTerm(currentTermId);
      } else {
        context.setSelectedTerm("");
      }

      setLoading(false);
    };

    getTerms();
  }, []);

  if (loading) return <ActivityIndicator />;

  return (
    <>
      <ScrollView
        style={{ backgroundColor: Colors[colorScheme].background }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <View style={AppStyles.section}>
          <Text style={styles.title}>{course.code.join(", ")}</Text>
          <Text style={styles.title}>{course.title}</Text>
          <View style={styles.row}>
            <Text>Quarter</Text>
            <Button
              text={
                context.selectedTerm != ""
                  ? termIdToName(context.selectedTerm)
                  : "Select"
              }
              onPress={() =>
                navigation.navigate("SelectQuarter", {
                  terms: Object.keys(terms),
                })
              }
            />
          </View>
          <View style={styles.row}>
            <Text>Units</Text>
            <View style={{ flexDirection: "row" }}>
              {Array.from(
                { length: course.unitsMax - course.unitsMin + 1 },
                (_, i) => i + course.unitsMin
              ).map((numUnits) => (
                <View style={{ marginLeft: Layout.spacing.small }}>
                  <SquareButton
                    num=""
                    text={`${numUnits}`}
                    onPress={() => setSelectedUnits(numUnits)}
                    size={Layout.buttonHeight.medium}
                    emphasized={selectedUnits === numUnits}
                  />
                </View>
              ))}
            </View>
          </View>
          <View style={styles.row}>
            <Text>Class times</Text>
            {/* {context.selectedTerm !== "" ? (
              <Text>{terms[`${context.selectedTerm}`][0].component}</Text>
              <>
                {terms[`${context.selectedTerm}`].map((sched) => {
                  <Text>{sched.component}</Text>;
                })}
              </>
            ) : null} */}
          </View>
        </View>
      </ScrollView>
      <View style={styles.ctaContainer}>
        <View style={{ width: "48%" }}>
          <Button text="Cancel" onPress={() => navigation.goBack()} />
        </View>
        <View style={{ width: "48%" }}>
          <Button
            text="Done"
            onPress={() => {
              console.log("Done pressed");
              // addEnrollmentDB();
            }}
            emphasized={true}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: Layout.text.xlarge,
    fontWeight: "500",
    marginBottom: Layout.spacing.small,
  },
  row: {
    ...AppStyles.row,
    marginVertical: Layout.spacing.medium,
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
