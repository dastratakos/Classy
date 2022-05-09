import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";

import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Icon, Text, View } from "../components/Themed";
import { useCallback, useContext, useEffect, useState } from "react";

import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import Colors from "../constants/Colors";
import { CourseProps } from "../types";
import Layout from "../constants/Layout";
import Separator from "../components/Separator";
import useColorScheme from "../hooks/useColorScheme";
import ReadMoreText from "../components/ReadMoreText";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import friendsData from "./friendsData";
import { useNavigation } from "@react-navigation/core";
import AppContext from "../context/Context";
import { G } from "react-native-svg";

const exploreCoursesLink =
  "https://explorecourses.stanford.edu/search?view=catalog&filter-coursestatus-Active=on&page=0&catalog=&academicYear=&q=";
// TODO: Carta requires Stanford sign-in...
const cartaLink = "https://carta-beta.stanford.edu/course/";

export default function Course({ route }: CourseProps) {
  const navigation = useNavigation();
  const context = useContext(AppContext);
  const colorScheme = useColorScheme();

  const [course, setCourse] = useState(route.params.course);
  const [favorited, setFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   getCourse(route.params.id);
  // }, []);

  // const getCourse = async (id: number) => {
  //   console.log("getting course:", id);

  //   const docRef = doc(db, "courses", `${id}`);
  //   const docSnap = await getDoc(docRef);

  //   if (docSnap.exists()) {
  //     console.log("data:", docSnap.data());
  //     setCourse(docSnap.data() as CourseType);
  //     setIsLoading(false);
  //   } else {
  //     console.log(`Could not find course: ${id}.`);
  //     alert(`Could not find course: ${id}.`);
  //   }
  // };

  useEffect(() => {
    const getFavorited = async (id: number) => {
      const q = query(
        collection(db, "favorites"),
        where("courseId", "==", id),
        where("userId", "==", context.user.id)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setFavorited(true);
      });
    };

    getFavorited(route.params.course.courseId);
  }, []);

  const handleFavoritePressed = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!favorited) {
      setFavorited(true);

      const data = {
        code: course.code,
        courseId: course.courseId,
        title: course.title,
        userId: context.user.id,
      };

      await addDoc(collection(db, "favorites"), data);
    } else {
      setFavorited(false);

      const q = query(
        collection(db, "favorites"),
        where("courseId", "==", course.courseId),
        where("userId", "==", context.user.id)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((res) => {
        deleteDoc(doc(db, "favorites", res.id));
      });
    }
  };

  if (isLoading) return <ActivityIndicator />;

  return (
    <>
      <ScrollView
        style={{ backgroundColor: Colors[colorScheme].background }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <View style={AppStyles.section}>
          <Text style={styles.title}>{course.code.join(", ")}</Text>
          <Text style={styles.title}>{course.title}</Text>
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
                onPress={() => handleCartaPress(course.code[0])}
              />
            </View>
          </View>
        </View>
        <Separator />
        {/* <View style={styles.friendsSection}>
        <Text style={styles.friendsHeader}>Friends</Text>
        <View style={AppStyles.section}>
          // TODO: use SectionList?
          {Object.keys(friendsData).map((termId) => (
            <View key={termId}>
              <Text style={styles.term}>
                getTermString({termId}) ({friendsData[termId].length})
              </Text>
              // TODO: use FriendList
              {friendsData[termId].map((friend) => (
                <FriendCard friend={friend} key={friend.id} />
              ))}
            </View>
          ))}
        </View>
      </View> */}
      </ScrollView>
      <View style={styles.ctaContainer}>
        <View style={{ flexGrow: 1 }}>
          <Button
            text="Add to Courses"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              navigation.navigate("AddEditCourse", { course });
            }}
            emphasized
          />
        </View>
        <View style={styles.favoriteButtonContainer}>
          <Pressable
            onPress={handleFavoritePressed}
            style={({ pressed }) => [
              styles.favoriteButton,
              { opacity: pressed ? 0.5 : 1 },
            ]}
          >
            <Icon
              name={favorited ? "star" : "star-o"}
              size={Layout.icon.medium}
              lightColor={Colors[colorScheme].tint}
              darkColor={Colors[colorScheme].tint}
            />
          </Pressable>
        </View>
      </View>
    </>
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
  },
  ctaContainer: {
    ...AppStyles.row,
    position: "absolute",
    bottom: Layout.spacing.medium,
    left: Layout.spacing.medium,
    right: Layout.spacing.medium,
    backgroundColor: "transparent",
  },
  favoriteButtonContainer: {
    ...AppStyles.boxShadow,
    marginLeft: Layout.spacing.small,
    borderRadius: Layout.radius.medium,
    height: Layout.buttonHeight.medium,
    width: Layout.buttonHeight.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButton: {
    borderRadius: Layout.radius.medium,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
