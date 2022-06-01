import { ActivityIndicator, Icon, Icon3, Text, View } from "../components/Themed";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Course, History, User } from "../types";
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
import useColorScheme from "../hooks/useColorScheme";

export default function Search() {
  const context = useContext(AppContext);

  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [focused, setFocused] = useState<boolean>(false);

  const [userSearchResults, setUserSearchResults] = useState<User[]>([]);
  const [showFullUserResults, setShowFullUserResults] =
    useState<boolean>(false);
  const [lastUser, setLastUser] = useState<User>({} as User);
  const [usersRefreshing, setUsersRefreshing] = useState<boolean>(true);
  const [stopUserSearch, setStopUserSearch] = useState<boolean>(false);

  const [courseSearchResults, setCourseSearchResults] = useState<Course[]>([]);
  const [showFullCourseResults, setShowFullCourseResults] =
    useState<boolean>(false);
  const [lastCourse, setLastCourse] = useState<Course>({} as Course);
  const [coursesRefreshing, setCoursesRefreshing] = useState<boolean>(true);
  const [stopCourseSearch, setStopCourseSearch] = useState<boolean>(false);

  const [fullHistory, setFullHistory] = useState<History>({
    people: [],
    courses: [],
  } as History);

  const [historyLoading, setHistoryLoading] = useState<boolean>(true);

  console.log("rendering search page");

  useEffect(() => {
    const loadScreen = async () => {
      collectHistory(context.user.id);
      handleSearchUsers("");
      handleSearchCourses("");
    };
    loadScreen();
  }, []);

  const collectHistory = async (id: string) => {
    setHistoryLoading(true);
    setFullHistory(await getHistory(id));
    setHistoryLoading(false);
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

  const handleSearchUsers = async (search: string) => {
    setUsersRefreshing(true);

    if (search === "") {
      setUserSearchResults([]);
      setUsersRefreshing(false);
      return;
    }

    let { users, lastVisible } = await searchUsers(context.user.id, search);
    setUserSearchResults([...users]);

    console.log("users.length =", users.length);

    setLastUser(lastVisible);
    setUsersRefreshing(false);
  };

  const handleSearchMoreUsers = async () => {
    if (stopUserSearch) return;

    // setUsersRefreshing(true);

    if (!lastUser) {
      console.log("Searching users:", searchPhrase);
      let { users, lastVisible } = await searchUsers(
        context.user.id,
        searchPhrase,
        10
      );
      setUserSearchResults([...users]);
      setLastUser(lastVisible);

      if (users.length < 10) setStopUserSearch(true);
    } else {
      console.log("Searching more users:", searchPhrase);
      let { users, lastVisible } = await searchMoreUsers(
        context.user.id,
        searchPhrase,
        lastUser
      );
      setUserSearchResults([...userSearchResults, ...users]);
      setLastUser(lastVisible);

      if (users.length < 10) setStopUserSearch(true);
    }

    // setUsersRefreshing(false);
  };

  const handleSearchCourses = async (search: string) => {
    setCoursesRefreshing(true);

    if (search === "") {
      setCourseSearchResults([]);
      setCoursesRefreshing(false);
      return;
    }
    let { courses, lastVisible } = await searchCourses(search);
    setCourseSearchResults([...courses]);

    console.log("courses.length =", courses.length);

    setLastCourse(lastVisible);
    setCoursesRefreshing(false);
  };

  const handleSearchMoreCourses = async () => {
    if (stopCourseSearch) return;

    // setCoursesRefreshing(true);

    if (!lastCourse) {
      console.log("Searching courses:", searchPhrase);
      let { courses, lastVisible } = await searchCourses(searchPhrase, 10);
      setLastCourse(lastVisible);
      setCourseSearchResults([...courses]);

      if (courses.length < 10) setStopCourseSearch(true);
    } else {
      console.log("Searching more courses:", searchPhrase);
      let { courses, lastVisible } = await searchMoreCourses(
        searchPhrase,
        lastCourse
      );
      console.log("1");
      setLastCourse(lastVisible);
      console.log("2");
      setCourseSearchResults([...courseSearchResults, ...courses]);
      console.log("3");

      if (courses.length < 10) setStopCourseSearch(true);
    }

    // setCoursesRefreshing(false);
  };

  const PeopleHistory = () => (
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
                  <Icon3 name="close" size={Layout.icon.small} />
                </TouchableOpacity>
              }
              onPress={() => handleAddPersonToHistory(item)}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
        refreshing={historyLoading}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: Layout.spacing.medium,
        }}
        ListEmptyComponent={
          <>
            {historyLoading ? (
              <ActivityIndicator />
            ) : (
              <EmptyList
                SVGElement={SVGSearch}
                primaryText="Find people"
                secondaryText="Search by first or last name"
              />
            )}
          </>
        }
      />
    </>
  );

  const PeopleResults = () => (
    <>
      {showFullUserResults ? (
        <FlatList
          data={userSearchResults}
          renderItem={({ item }) => (
            <FriendCard
              friend={item}
              onPress={() => handleAddPersonToHistory(item)}
            />
          )}
          keyExtractor={(item) => item.id}
          onEndReached={() => {
            if (!usersRefreshing) handleSearchMoreUsers();
          }}
          onEndReachedThreshold={0}
          refreshing={usersRefreshing}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: Layout.spacing.medium,
          }}
          ListFooterComponent={
            stopUserSearch ? null : (
              <View
                style={{
                  marginTop: Layout.spacing.small,
                  marginBottom: Layout.spacing.medium,
                }}
              >
                <ActivityIndicator />
              </View>
            )
          }
        />
      ) : (
        <FlatList
          data={userSearchResults}
          renderItem={({ item }) => (
            <FriendCard
              friend={item}
              onPress={() => handleAddPersonToHistory(item)}
            />
          )}
          keyExtractor={(item) => item.id}
          refreshing={usersRefreshing}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: Layout.spacing.medium,
          }}
          ListFooterComponent={
            <>
              {/* Only display if we have at least 3 matching users */}
              {userSearchResults.length === 3 && (
                <TouchableOpacity
                  onPress={() => {
                    handleSearchMoreUsers();
                    setShowFullUserResults(true);
                  }}
                  style={{
                    alignSelf: "center",
                    marginTop: Layout.spacing.small,
                  }}
                >
                  <Text style={{ color: Colors.lightBlue }}>
                    See all results
                  </Text>
                </TouchableOpacity>
              )}
            </>
          }
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
      )}
    </>
  );

  const CoursesHistory = () => (
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
                  <Icon3 name="close" size={Layout.icon.small} />
                </TouchableOpacity>
              }
              onPress={() => handleAddCourseToHistory(item)}
            />
          </View>
        )}
        keyExtractor={(item) => item.courseId.toString()}
        refreshing={historyLoading}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: Layout.spacing.medium,
        }}
        ListEmptyComponent={
          historyLoading ? (
            <ActivityIndicator />
          ) : (
            <EmptyList
              SVGElement={SVGSearch}
              primaryText="Find courses"
              secondaryText={
                'Search by code or name\n(e.g. "SOC1", "SOC 1", or\n"Introduction to Sociology")'
              }
            />
          )
        }
      />
    </>
  );

  const CoursesResults = () => (
    <>
      {showFullCourseResults ? (
        <FlatList
          data={courseSearchResults}
          renderItem={({ item }) => (
            <View key={item.courseId.toString()}>
              <CourseCard
                course={item}
                emphasize={false}
                onPress={() => handleAddCourseToHistory(item)}
                searchTerm={searchPhrase}
              />
            </View>
          )}
          keyExtractor={(item) => item.courseId.toString()}
          onEndReached={() => {
            if (!coursesRefreshing) handleSearchMoreCourses();
          }}
          onEndReachedThreshold={0}
          refreshing={coursesRefreshing}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: Layout.spacing.medium,
          }}
          ListFooterComponent={
            stopCourseSearch ? null : (
              <View
                style={{
                  marginTop: Layout.spacing.small,
                  marginBottom: Layout.spacing.medium,
                }}
              >
                <ActivityIndicator />
              </View>
            )
          }
        />
      ) : (
        <FlatList
          data={courseSearchResults}
          renderItem={({ item }) => (
            <View key={item.courseId.toString()}>
              <CourseCard
                course={item}
                emphasize={false}
                onPress={() => handleAddCourseToHistory(item)}
                searchTerm={searchPhrase}
              />
            </View>
          )}
          keyExtractor={(item) => item.courseId.toString()}
          refreshing={coursesRefreshing}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: Layout.spacing.medium,
          }}
          ListFooterComponent={
            <>
              {/* Only display if we have at least 3 matching courses */}
              {courseSearchResults.length === 3 && (
                <TouchableOpacity
                  onPress={() => {
                    handleSearchMoreCourses();
                    setShowFullCourseResults(true);
                  }}
                  style={{
                    alignSelf: "center",
                    marginTop: Layout.spacing.small,
                  }}
                >
                  <Text style={{ color: Colors.lightBlue }}>
                    See all results
                  </Text>
                </TouchableOpacity>
              )}
            </>
          }
          ListEmptyComponent={
            coursesRefreshing ? (
              <ActivityIndicator />
            ) : (
              <EmptyList
                SVGElement={SVGVoid}
                primaryText={'No matching courses for "' + searchPhrase + '"'}
                secondaryText={
                  'Search by code or name\n(e.g. "SOC1", "SOC 1", or\n"Introduction to Sociology")'
                }
              />
            )
          }
        />
      )}
    </>
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
            setShowFullUserResults(false);
            setShowFullCourseResults(false);
            setStopUserSearch(false);
            setStopCourseSearch(false);
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
