import * as WebBrowser from "expo-web-browser";

import { ScrollView, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import { useCallback, useEffect, useState } from "react";

import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import Colors from "../constants/Colors";
import { Course as CourseType, CourseProps } from "../types";
import FriendCard from "../components/FriendCard";
import Layout from "../constants/Layout";
import Separator from "../components/Separator";
import WideButton from "../components/Buttons/WideButton";
import useColorScheme from "../hooks/useColorScheme";
import ReadMoreText from "../components/ReadMoreText";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import friendsData from "./friendsData";

const exploreCoursesLink =
  "https://explorecourses.stanford.edu/search?view=catalog&filter-coursestatus-Active=on&page=0&catalog=&academicYear=&q=";
// TODO: Carta requires Stanford sign-in...
const cartaLink = "https://carta-beta.stanford.edu/course/";

export default function Course({ route }: CourseProps) {
  const colorScheme = useColorScheme();

  const [course, setCourse] = useState({} as CourseType);

  useEffect(() => {
    getCourse(route.params.id);
  }, []);

  const getCourse = async (id: string) => {
    console.log("getting course:", id);

    const docRef = doc(db, "courses", `${id}`);
    console.log("hi");
    const docSnap = await getDoc(docRef);
    console.log("mel");

    if (docSnap.exists()) {
      console.log("data:", docSnap.data());
      setCourse(docSnap.data() as CourseType);
    } else {
      console.log(`Could not find course: ${id}`);
      alert("This course does not exist.");
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: Colors[colorScheme].background }}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={AppStyles.section}>
        <Text style={styles.title}>
          {course.code}: {course.title}
        </Text>
        <Text style={styles.unitsWays}>
          Units: {course.unitsMin}
          {course.unitsMin === course.unitsMax ? "" : `-${course.unitsMax}`},
          GERS: {course.gers || "None"}
        </Text>
        <ReadMoreText text={course.description} />
        <View
          style={[
            AppStyles.row,
            {
              justifyContent: "space-between",
              marginVertical: Layout.spacing.medium,
            },
          ]}
        >
          <View style={{ width: "48%" }}>
            <Button
              text="Explore Courses"
              onPress={() => handleExplorePress(course.courseId)}
            />
          </View>
          <View style={{ width: "48%" }}>
            <Button
              text="Carta"
              onPress={() => handleCartaPress(course.code)}
            />
          </View>
        </View>
        <WideButton
          text="Add to Courses"
          onPress={() => console.log("Add to Courses pressed")}
        />
      </View>
      <Separator />
      <View style={styles.friendsSection}>
        <Text style={styles.friendsHeader}>Friends</Text>
        <View style={AppStyles.section}>
          {Object.keys(friendsData).map((termId) => (
            <View key={termId}>
              <Text style={styles.term}>
                getTermString({termId}) ({friendsData[termId].length})
              </Text>
              {friendsData[termId].map((friend, i) => (
                <FriendCard
                  id={friend.id}
                  name={friend.name}
                  major={friend.major}
                  gradYear={friend.gradYear}
                  photoUrl={friend.photoUrl}
                  key={i}
                />
              ))}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function handleExplorePress(courseId: number) {
  WebBrowser.openBrowserAsync(`${exploreCoursesLink}${courseId}`);
}

function handleCartaPress(courseCode: string) {
  /* Remove spaces from the courseCode. */
  WebBrowser.openBrowserAsync(cartaLink + courseCode.replace(/\s+/g, ""));
}

const styles = StyleSheet.create({
  title: {
    fontSize: Layout.text.xlarge,
    fontWeight: "500",
    marginBottom: Layout.spacing.small,
  },
  unitsWays: {
    fontWeight: "bold",
    color: Colors.green,
    marginBottom: Layout.spacing.small,
  },
  friendsSection: {
    width: "100%",
    alignItems: "center",
  },
  friendsHeader: {
    fontSize: Layout.text.large,
    fontWeight: "500",
    marginTop: Layout.spacing.small,
    marginBottom: Layout.spacing.medium,
  },
  term: {
    fontSize: Layout.text.medium,
    fontWeight: "500",
  }
});
