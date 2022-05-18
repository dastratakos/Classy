import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";

import { ActivityIndicator, Icon, Text, View } from "../components/Themed";
import { CourseProps, Course as CourseType, User } from "../types";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import {
  addFavorite,
  deleteFavorite,
  getIsFavorited,
} from "../services/courses";
import { useContext, useEffect, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import Colors from "../constants/Colors";
import EmptyList from "../components/EmptyList";
import FriendList from "../components/Lists/FriendList";
import Layout from "../constants/Layout";
import ReadMoreText from "../components/ReadMoreText";
import SVGCamping from "../assets/images/undraw/camping.svg";
import Separator from "../components/Separator";
import { getAllPeopleIdsInCourse } from "../services/friends";
import { getUser } from "../services/users";
import { termIdToFullName } from "../utils";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

const exploreCoursesLink =
  "https://explorecourses.stanford.edu/search?view=catalog&filter-coursestatus-Active=on&page=0&catalog=&academicYear=&q=";
// TODO: Carta requires Stanford sign-in...
const cartaLink = "https://carta-beta.stanford.edu/course/";

export default function Course({ route }: CourseProps) {
  const navigation = useNavigation();
  const context = useContext(AppContext);
  const colorScheme = useColorScheme();

  const course: CourseType = route.params.course;
  const [friendsData, setFriendsData] = useState<Object>({});
  const [favorited, setFavorited] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadScreen = async () => {
      setFavorited(
        await getIsFavorited(context.user.id, route.params.course.courseId)
      );
      const { friendIds, publicIds } = await getAllPeopleIdsInCourse(
        context.user.id,
        route.params.course.courseId
      );

      let friendsDataObj = {};
      for (let term of Object.keys(friendIds)) {
        if (!friendIds[`${term}`].length) continue;

        let friends: User[] = [];
        for (let id of friendIds[`${term}`]) {
          friends.push(await getUser(id));
        }
        friends.sort((a, b) => {
          if (!a.name) return 1;
          if (!b.name) return -1;
          return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1;
        });
        friendsDataObj[`${term}`] = friends;
      }

      console.log("friendsDataObj:", friendsDataObj);

      setFriendsData(friendsDataObj);

      setIsLoading(false);
    };

    loadScreen();
  }, []);

  const handleFavoritePressed = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!favorited) {
      setFavorited(true);
      addFavorite(context.user.id, course);
    } else {
      setFavorited(false);
      deleteFavorite(context.user.id, course.courseId);
    }
  };

  if (isLoading) return <ActivityIndicator />;

  return (
    <>
      <ScrollView
        style={{ backgroundColor: Colors[colorScheme].background }}
        contentContainerStyle={{
          alignItems: "center",
          paddingBottom: Layout.buttonHeight.medium + Layout.spacing.medium,
        }}
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
                marginTop: Layout.spacing.small,
              },
            ]}
          >
            <View style={{ width: "48%", backgroundColor: "transparent" }}>
              <Button
                text="Explore Courses"
                onPress={() => handleExplorePress(course.courseId)}
              />
            </View>
            <View style={{ width: "48%", backgroundColor: "transparent" }}>
              <Button
                text="Carta"
                onPress={() => handleCartaPress(course.code[0])}
              />
            </View>
          </View>
        </View>
        <Separator />
        <View style={AppStyles.section}>
          {Object.keys(friendsData).length > 0 ? (
            <>
              <Text style={styles.friendsHeader}>
                {"Friends in " + course.code.join(", ")}
              </Text>
              {/* TODO: use SectionList? */}
              {Object.keys(friendsData)
                .sort()
                .reverse()
                .map((termId) => (
                  <View key={termId}>
                    <Text style={styles.term}>
                      {termIdToFullName(termId)} ({friendsData[termId].length})
                    </Text>
                    <FriendList friends={friendsData[termId]} />
                  </View>
                ))}
            </>
          ) : (
            <EmptyList
              SVGElement={SVGCamping}
              primaryText="No one in this course yet!"
            />
          )}
        </View>
      </ScrollView>
      <View style={styles.ctaContainer}>
        <View style={{ flexGrow: 1 }}>
          <Button
            text="Add to Courses"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              navigation.navigate("AddCourse", { course });
            }}
            emphasized
          />
        </View>
        <View
          style={[
            styles.favoriteButtonContainer,
            { backgroundColor: Colors[colorScheme].cardBackground },
          ]}
        >
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
  friendsHeader: {
    fontSize: Layout.text.large,
    fontWeight: "500",
    marginVertical: Layout.spacing.xxsmall,
    textAlign: "center",
  },
  term: {
    fontSize: Layout.text.medium,
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
