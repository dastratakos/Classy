import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, FlatList } from "react-native";
import { View } from "../components/Themed";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import SearchBar from "../components/SearchBar";
import useColorScheme from "../hooks/useColorScheme";
import TabView from "../components/TabView";
import { Course, User } from "../types";
import { searchCourses, searchMoreCourses } from "../services/courses";
import { searchMoreUsers, searchUsers } from "../services/users";
import FriendCard from "../components/Cards/FriendCard";
import CourseCard from "../components/Cards/CourseCard";
import Layout from "../constants/Layout";

export default function Search() {
  const context = useContext(AppContext);
  const colorScheme = useColorScheme();

  const [searchPhrase, setSearchPhrase] = useState("");
  const [focused, setFocused] = useState(false);
  const [userSearchResults, setUserSearchResults] = useState([] as User[]);
  const [courseSearchResults, setCourseSearchResults] = useState(
    [] as Course[]
  );
  const [lastUser, setLastUser] = useState({} as User);
  const [lastCourse, setLastCourse] = useState({} as Course);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const loadScreen = async () => {
      handleSearchUsers("");
    };
    loadScreen();
  }, []);

  const handleSearchUsers = async (search: string) => {
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
    setRefreshing(false);
  };

  const handleSearchCourses = async (search: string) => {
    if (search === "") {
      setCourseSearchResults([]);
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
    setRefreshing(false);
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
          refreshing={refreshing}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: Layout.spacing.medium,
          }}
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
          keyExtractor={(item) => `${item.courseId}`}
          onEndReached={() => handleSearchCourses(searchPhrase)}
          onEndReachedThreshold={0}
          refreshing={refreshing}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: Layout.spacing.medium,
          }}
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
      <TabView tabs={tabs} addTabMargin />
    </View>
  );
}

const styles = StyleSheet.create({});
