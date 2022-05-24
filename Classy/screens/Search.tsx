import { ActivityIndicator, Icon, Text, View } from "../components/Themed";
import { Course, History, User } from "../types";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { getHistory, setHistory } from "../services/history";
import { searchCourses, searchMoreCourses } from "../services/courses";
import { searchMoreUsers, searchUsers } from "../services/users";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import CourseCard from "../components/Cards/CourseCard";
import EmptyList from "../components/EmptyList";
import FriendCard from "../components/Cards/FriendCard";
import Layout from "../constants/Layout";
import SVGSearch from "../assets/images/undraw/courseSearch.svg";
import SVGVoid from "../assets/images/undraw/void.svg";
import SearchBar from "../components/SearchBar";
import TabView from "../components/TabView";
import { getFriendIds } from "../services/friends";
import useColorScheme from "../hooks/useColorScheme";

export default function Search() {
  const context = useContext(AppContext);
  const colorScheme = useColorScheme();

  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [friendIds, setFriendIds] = useState<string[]>([]);
  const [focused, setFocused] = useState<boolean>(false);
  const [userSearchResults, setUserSearchResults] = useState<User[]>([]);
  const [courseSearchResults, setCourseSearchResults] = useState<Course[]>([]);
  const [lastUser, setLastUser] = useState<User>({} as User);
  const [lastCourse, setLastCourse] = useState<Course>({} as Course);
  const [fullHistory, setFullHistory] = useState<History>({
    people: [],
    courses: [],
  } as History);

  const [usersRefreshing, setUsersRefreshing] = useState<boolean>(true);
  const [coursesRefreshing, setCoursesRefreshing] = useState<boolean>(true);

  useEffect(() => {
    const loadScreen = async () => {
      // setFriendIds(await getFriendIds(context.user.id));
      collectHistory(context.user.id);
      handleSearchUsers("");
      handleSearchCourses("");
    };
    loadScreen();
  }, []);

  const collectHistory = async (id: string) => {
    setUsersRefreshing(true);
    setCoursesRefreshing(true);
    setFullHistory(await getHistory(id));
    setUsersRefreshing(false);
    setCoursesRefreshing(false);
  };

  const handleSearchUsers = async (search: string) => {
    setUsersRefreshing(true);

    if (search === "") {
      // setUserSearchResults(await searchUsers(context.user.id, search, 25));
      setUserSearchResults([]);
      setUsersRefreshing(false);
      return;
    }

    let res;
    // if (!lastUser) {
    // console.log("Searching users:", search);
    res = await searchUsers(context.user.id, search);
    setUserSearchResults([...res]);
    // } else {
    //   console.log("Searching more users:", search);
    //   res = await searchMoreUsers(context.user.id, search, lastUser);
    //   setUserSearchResults([...userSearchResults, ...res]);
    // }
    // console.log("user res:", res.length);
    setLastUser(res[res.length - 1]);
    setUsersRefreshing(false);
  };

  const handleSearchCourses = async (search: string) => {
    setCoursesRefreshing(true);

    if (search === "") {
      setCourseSearchResults([]);
      setCoursesRefreshing(false);
      return;
    }
    let res;
    // if (!lastCourse) {
    // console.log("Searching courses:", search);
    res = await searchCourses(search);
    setCourseSearchResults([...res]);
    // } else {
    //   console.log("Searching more courses:", search);
    //   res = await searchMoreCourses(search, lastCourse);
    //   setCourseSearchResults([...courseSearchResults, ...res]);
    // }
    // console.log("course res:", res.length);
    setLastCourse(res[res.length - 1]);
    setCoursesRefreshing(false);
  };

  const handleClearPeoplePressed = async () => {
    const newHistory = { people: [], courses: fullHistory.courses };
    setFullHistory(newHistory);
    setHistory(context.user.id, newHistory);
  };

  const handleClearCoursesPressed = async () => {
    const newHistory = { people: fullHistory.people, courses: [] };
    setFullHistory(newHistory);
    setHistory(context.user.id, newHistory);
  };

  const handleRemovePersonFromHistory = async (userId: string) => {
    const newPeople: User[] = fullHistory.people.filter(
      (user: User) => user.id !== userId
    );

    const newHistory = { people: newPeople, courses: fullHistory.courses };
    setFullHistory(newHistory);
    setHistory(context.user.id, newHistory);
  };

  const handleAddPersonToHistory = async (user: User) => {
    /* Only store the last 10 searches. */
    const newPeople: User[] = [
      user,
      ...fullHistory.people.filter((u: User) => u.id !== user.id),
    ].slice(0, 10);

    const newHistory = { people: newPeople, courses: fullHistory.courses };
    setFullHistory(newHistory);
    setHistory(context.user.id, newHistory);
  };

  const handleRemoveCourseFromHistory = async (courseId: number) => {
    const newCourses: Course[] = fullHistory.courses.filter(
      (course: Course) => course.courseId !== courseId
    );

    const newHistory = { people: fullHistory.people, courses: newCourses };
    setFullHistory(newHistory);
    setHistory(context.user.id, newHistory);
  };

  const handleAddCourseToHistory = async (course: Course) => {
    /* Only store the last 10 searches. */
    const newCourses: Course[] = [
      course,
      ...fullHistory.courses.filter(
        (c: Course) => c.courseId !== course.courseId
      ),
    ].slice(0, 10);

    const newHistory = { people: fullHistory.people, courses: newCourses };
    setFullHistory(newHistory);
    setHistory(context.user.id, newHistory);
  };

  const PeopleHistory = () => {
    if (usersRefreshing) return <ActivityIndicator />;

    return (
      // TODO: make history deletable
      <>
        {fullHistory.people && fullHistory.people.length > 0 && (
          <View
            style={{
              ...AppStyles.row,
              paddingHorizontal: Layout.spacing.medium,
            }}
          >
            <Text style={{ fontWeight: "500" }}>Recent searches</Text>
            <TouchableOpacity onPress={handleClearPeoplePressed}>
              <Text style={{ color: Colors.lightBlue }}>Clear</Text>
            </TouchableOpacity>
          </View>
        )}
        <FlatList
          data={fullHistory.people}
          renderItem={({ item }) => (
            <View style={{ ...AppStyles.row }}>
              <FriendCard
                friend={item}
                rightElement={
                  <TouchableOpacity
                    onPress={() => handleRemovePersonFromHistory(item.id)}
                    style={{ marginLeft: Layout.spacing.xsmall }}
                  >
                    <Icon name="close" size={Layout.icon.small} />
                  </TouchableOpacity>
                }
                onPress={() => handleAddPersonToHistory(item)}
              />
            </View>
          )}
          keyExtractor={(item) => item.id}
          refreshing={usersRefreshing}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: Layout.spacing.medium,
          }}
          ListEmptyComponent={
            usersRefreshing ? (
              <ActivityIndicator />
            ) : (
              <EmptyList
                SVGElement={SVGSearch}
                primaryText="Find people"
                secondaryText="Search by first or last name"
              />
            )
          }
        />
      </>
    );
  };

  const PeopleResults = () => (
    <FlatList
      data={userSearchResults}
      renderItem={({ item }) => (
        <FriendCard
          friend={item}
          onPress={() => handleAddPersonToHistory(item)}
        />
      )}
      keyExtractor={(item) => item.id}
      // onEndReached={() => handleSearchUsers(searchPhrase)}
      // onEndReachedThreshold={0}
      refreshing={usersRefreshing}
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: Layout.spacing.medium,
      }}
      ListEmptyComponent={
        usersRefreshing ? (
          <ActivityIndicator />
        ) : (
          <EmptyList
            SVGElement={SVGVoid}
            primaryText={`No matching users for "${searchPhrase}"`}
            secondaryText="Try searching again using a different spelling"
          />
        )
      }
    />
  );

  const CoursesHistory = () => (
    // TODO: make history deletable
    <>
      {fullHistory.courses && fullHistory.courses.length > 0 && (
        <View
          style={{
            ...AppStyles.row,
            paddingHorizontal: Layout.spacing.medium,
          }}
        >
          <Text style={{ fontWeight: "500" }}>Recent searches</Text>
          <TouchableOpacity onPress={handleClearCoursesPressed}>
            <Text style={{ color: Colors.lightBlue }}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={fullHistory.courses}
        renderItem={({ item }) => (
          <View key={item.courseId.toString()}>
            <CourseCard
              course={item}
              emphasize={false}
              rightElement={
                <TouchableOpacity
                  onPress={() => handleRemoveCourseFromHistory(item.courseId)}
                  style={{ marginLeft: Layout.spacing.xsmall }}
                >
                  <Icon name="close" size={Layout.icon.small} />
                </TouchableOpacity>
              }
              onPress={() => handleAddCourseToHistory(item)}
            />
          </View>
        )}
        keyExtractor={(item) => item.courseId.toString()}
        refreshing={coursesRefreshing}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: Layout.spacing.medium,
        }}
        ListEmptyComponent={
          coursesRefreshing ? (
            <ActivityIndicator />
          ) : (
            <EmptyList
              SVGElement={SVGSearch}
              primaryText="Find courses"
              secondaryText='Search by code or name\n(e.g. "SOC1", "SOC 1", or\n"Introduction to Sociology")'
            />
          )
        }
      />
    </>
  );

  const CoursesResults = () => (
    <FlatList
      data={courseSearchResults}
      renderItem={({ item }) => (
        <View key={item.courseId.toString()}>
          <CourseCard
            course={item}
            emphasize={false}
            onPress={() => handleAddCourseToHistory(item)}
          />
        </View>
      )}
      keyExtractor={(item) => item.courseId.toString()}
      // onEndReached={() => handleSearchCourses(searchPhrase)}
      // onEndReachedThreshold={0}
      refreshing={coursesRefreshing}
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: Layout.spacing.medium,
      }}
      ListEmptyComponent={
        coursesRefreshing ? (
          <ActivityIndicator />
        ) : (
          <EmptyList
            SVGElement={SVGVoid}
            primaryText={'No matching courses for "' + searchPhrase + '"'}
            secondaryText='Search by code or name\n(e.g. "SOC1", "SOC 1", or\n"Introduction to Sociology")'
          />
        )
      }
    />
  );

  const tabs = [
    {
      label: "People",
      component: (
        <>{searchPhrase === "" ? <PeopleHistory /> : <PeopleResults />}</>
      ),
    },
    {
      label: "Courses",
      component: (
        <>{searchPhrase === "" ? <CoursesHistory /> : <CoursesResults />}</>
      ),
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View style={AppStyles.section}>
        <SearchBar
          placeholder="Search courses or people..."
          searchPhrase={searchPhrase}
          onChangeText={(text) => {
            setSearchPhrase(text);
            setLastUser({} as User);
            setLastCourse({} as Course);
            handleSearchUsers(text);
            handleSearchCourses(text);
          }}
          focused={focused}
          setFocused={setFocused}
        />
      </View>
      <TabView
        tabs={tabs}
        addTabMargin
        selectedStyle={{ backgroundColor: Colors.pink }}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
