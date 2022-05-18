import { Course, User } from "../types";
import { FlatList, StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { getFriendIds, getNumFriendInCourse } from "../services/friends";
import { searchCourses, searchMoreCourses } from "../services/courses";
import { searchMoreUsers, searchUsers } from "../services/users";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import CourseCard from "../components/Cards/CourseCard";
import EmptyList from "../components/EmptyList";
import FriendCard from "../components/Cards/FriendCard";
import Layout from "../constants/Layout";
import SVGCourseSearch from "../assets/images/undraw/courseSearch.svg";
import SVGVoid from "../assets/images/undraw/void.svg";
import SearchBar from "../components/SearchBar";
import TabView from "../components/TabView";
import { ActivityIndicator, View } from "../components/Themed";
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

  const [usersRefreshing, setUsersRefreshing] = useState<boolean>(true);
  const [coursesRefreshing, setCoursesRefreshing] = useState<boolean>(true);

  useEffect(() => {
    const loadScreen = async () => {
      setFriendIds(await getFriendIds(context.user.id));
      handleSearchUsers("");
      handleSearchCourses("");
    };
    loadScreen();
  }, []);

  const handleSearchUsers = async (search: string) => {
    setUsersRefreshing(true);

    if (search === "") {
      setUserSearchResults(await searchUsers(context.user.id, search, 25));
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

  const tabs = [
    {
      label: "People",
      component: (
        <FlatList
          data={userSearchResults}
          renderItem={({ item }) => <FriendCard friend={item} />}
          keyExtractor={(item) => item.id}
          onEndReached={() => handleSearchUsers(searchPhrase)}
          onEndReachedThreshold={0}
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
      ),
    },
    {
      label: "Courses",
      component: (
        <FlatList
          data={courseSearchResults}
          renderItem={({ item, index }) => (
            <CourseCard
              course={item}
              key={index.toString()}
              numFriends={0}
              emphasize={false}
            />
          )}
          keyExtractor={(item) => item.courseId.toString()}
          onEndReached={() => handleSearchCourses(searchPhrase)}
          onEndReachedThreshold={0}
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
                SVGElement={searchPhrase != "" ? SVGVoid : SVGCourseSearch}
                primaryText={
                  searchPhrase != ""
                    ? 'No matching courses for "' + searchPhrase + '"'
                    : "Find courses"
                }
                secondaryText={
                  searchPhrase != ""
                    ? "Try searching again using a different spelling or keyword"
                    : 'Search by code or name\n(e.g. "SOC1", "SOC 1", or\n"Introduction to Sociology")'
                }
              />
            )
          }
        />
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
