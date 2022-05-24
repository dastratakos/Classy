import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";

import {
  ActivityIndicator,
  Icon,
  Icon3,
  Text,
  View,
} from "../components/Themed";
import { CourseProps, Course as CourseType, User } from "../types";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
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
import DropDownPicker from "react-native-dropdown-picker";
import EmptyList from "../components/EmptyList";
import FriendList from "../components/Lists/FriendList";
import Layout from "../constants/Layout";
import Popover from "react-native-popover-view";
import ReadMoreText from "../components/ReadMoreText";
import SVGCamping from "../assets/images/undraw/camping.svg";
import Separator from "../components/Separator";
import Toast from "react-native-toast-message";
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
  const [peopleData, setPeopleData] = useState<Object>({});
  const [favorited, setFavorited] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(true);

  const [quarter, setQuarter] = useState("all");
  const [quarterOpen, setQuarterOpen] = useState(false);
  const [quarterItems, setQuarterItems] = useState([]);

  const [filter, setFilter] = useState<string>("All");
  const [popoverVisible, setPopoverVisible] = useState<boolean>(false);

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);

    setFavorited(
      await getIsFavorited(context.user.id, route.params.course.courseId)
    );
    const people = await getAllPeopleIdsInCourse(
      context.user.id,
      route.params.course.courseId
    );

    let quarterArr = [];

    let peopleObj = {};
    for (let term of Object.keys(people)) {
      if (
        !people[`${term}`].friendIds.length &&
        !people[`${term}`].publicIds.length
      )
        continue;

      quarterArr.push({ label: termIdToFullName(term), value: term });

      /* Gather friends. */
      let friends: User[] = [];
      for (let id of people[`${term}`].friendIds)
        friends.push(await getUser(id));
      friends.sort((a, b) => {
        if (!a.name) return 1;
        if (!b.name) return -1;
        return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1;
      });

      /* Gather public users. */
      let publicUsers: User[] = [];
      for (let id of people[`${term}`].publicIds)
        publicUsers.push(await getUser(id));
      publicUsers.sort((a, b) => {
        if (!a.name) return 1;
        if (!b.name) return -1;
        return a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1;
      });

      peopleObj[`${term}`] = { friends, publicUsers };
    }

    quarterArr.sort((a, b) => (a.value < b.value ? 1 : -1));
    setQuarterItems([{ label: "All Quarters", value: "all" }, ...quarterArr]);

    setPeopleData(peopleObj);

    setRefreshing(false);
  };

  const handleFavoritePressed = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!favorited) {
      setFavorited(true);
      addFavorite(context.user.id, course);
      Toast.show({
        type: "info",
        text1: "Added course to favorites",
      });
    } else {
      setFavorited(false);
      deleteFavorite(context.user.id, course.courseId);
      Toast.show({
        type: "info",
        text1: "Removed course from favorites",
      });
    }
  };

  if (refreshing) return <ActivityIndicator />;
  return (
    <>
      <ScrollView
        style={{ backgroundColor: Colors[colorScheme].background }}
        contentContainerStyle={{
          alignItems: "center",
          paddingBottom: Layout.buttonHeight.medium + Layout.spacing.medium,
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
        <Separator overrideStyles={{ marginBottom: 0 }} />
        <View style={AppStyles.section}>
          {Object.keys(peopleData).length > 0 ? (
            <>
              <Text style={styles.friendsHeader} numberOfLines={1}>
                {"People in " + course.code.join(", ")}
              </Text>
              <View
                style={[AppStyles.row, { marginBottom: Layout.spacing.medium }]}
              >
                {/* <View style={{ width: Layout.icon.medium }} /> */}
                <View
                  style={{
                    width: 0,
                    flexGrow: 1,
                    marginRight: Layout.spacing.small,
                  }}
                >
                  <DropDownPicker
                    open={quarterOpen}
                    // onOpen={onQuarterOpen}
                    value={quarter}
                    items={quarterItems}
                    setOpen={setQuarterOpen}
                    setValue={(text) => {
                      setQuarter(text);
                    }}
                    setItems={setQuarterItems}
                    // multiple
                    // min={0}
                    // max={2}
                    placeholder="Quarter"
                    placeholderStyle={{
                      color: Colors[colorScheme].secondaryText,
                    }}
                    showBadgeDot={false}
                    dropDownDirection="TOP"
                    theme={colorScheme === "light" ? "LIGHT" : "DARK"}
                    style={{ backgroundColor: Colors[colorScheme].background }}
                    dropDownContainerStyle={{
                      backgroundColor: Colors[colorScheme].background,
                    }}
                  />
                </View>
                <Popover
                  isVisible={popoverVisible}
                  onRequestClose={() => setPopoverVisible(false)}
                  from={
                    <TouchableOpacity onPress={() => setPopoverVisible(true)}>
                      <Icon3 name="filter" size={Layout.icon.medium} />
                    </TouchableOpacity>
                  }
                >
                  {["All", "Friends", "Public"].map((mode, i) => (
                    <View key={mode}>
                      <TouchableOpacity
                        onPress={() => {
                          setPopoverVisible(false);
                          setFilter(mode);
                        }}
                        style={{
                          ...AppStyles.row,
                          padding: Layout.spacing.small,
                        }}
                      >
                        <Text style={{ marginRight: Layout.spacing.medium }}>
                          {mode}
                        </Text>
                        {filter === mode ? (
                          <Icon3 name="checkmark" size={Layout.icon.small} />
                        ) : (
                          <View
                            style={{
                              height: Layout.icon.small,
                              width: Layout.icon.small,
                            }}
                          />
                        )}
                      </TouchableOpacity>
                      {i < 2 && (
                        <View
                          style={{
                            height: 1,
                            backgroundColor:
                              Colors[colorScheme].tertiaryBackground,
                          }}
                        />
                      )}
                    </View>
                  ))}
                </Popover>
              </View>
              {/* TODO: use SectionList? */}
              {Object.keys(peopleData)
                .sort()
                .reverse()
                .map((termId) => (
                  <View key={termId}>
                    {(quarter === "all" || quarter === termId) && (
                      <View key={termId}>
                        <Text style={styles.term}>
                          {termIdToFullName(termId)} (
                          {peopleData[termId].friends.length +
                            peopleData[termId].publicUsers.length}
                          )
                        </Text>
                        {filter !== "Public" && (
                          <FriendList
                            friends={peopleData[termId].friends}
                            showEmptyElement={false}
                          />
                        )}
                        {filter !== "Friends" && (
                          <FriendList
                            friends={peopleData[termId].publicUsers}
                            showEmptyElement={false}
                            // requests
                          />
                        )}
                      </View>
                    )}
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
        <View style={{ flexGrow: 1, backgroundColor: "transparent" }}>
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
    marginBottom: Layout.spacing.small,
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
