import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, RefreshControl } from "react-native";
import { Text, View } from "../components/Themed";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import SearchBar from "../components/SearchBar";
import useColorScheme from "../hooks/useColorScheme";
import Layout from "../constants/Layout";
import TabView from "../components/TabView";
import CourseList from "../components/CourseList";
import FriendList from "../components/FriendList";
import { Course } from "../types";

export default function Search() {
  const context = useContext(AppContext);
  const colorScheme = useColorScheme();

  const [searchPhrase, setSearchPhrase] = useState("");
  const [focused, setFocused] = useState(false);
  const [peopleSearchResults, setPeopleSearchResults] = useState([]);
  const [courseSearchResults, setCourseSearchResults] = useState(
    [] as Course[]
  );

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const searchPeople = async () => {
      const q = query(collection(db, "users"), orderBy("name"), limit(15));

      const people = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.id !== context.user.id) people.push(doc.data());
      });
      setPeopleSearchResults([...people]);
    };
    searchPeople();
    searchCourses(searchPhrase);
  }, []);

  const searchCourses = async (search: string) => {
    if (search === "") {
      setCourseSearchResults([]);
      return;
    }

    // TODO: pagination
    const q2 = query(
      collection(db, "courses"),
      where("keywords", "array-contains", search.toLowerCase().trim()),
      orderBy("code"),
      limit(3)
    );

    const courses: Course[] = [];
    const querySnapshot2 = await getDocs(q2);
    querySnapshot2.forEach((doc) => {
      courses.push(doc.data() as Course);
    });
    setCourseSearchResults([...courses]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    searchCourses(searchPhrase);
    setRefreshing(false);
  };

  const tabs = [
    {
      label: "People",
      component: <FriendList friends={peopleSearchResults} />,
    },
    {
      label: "Courses",
      component: <CourseList courses={courseSearchResults} />,
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <View style={AppStyles.section}>
        <SearchBar
          placeholder="Search courses or people..."
          searchPhrase={searchPhrase}
          onChangeText={(text) => {
            console.log("new text =", text)
            setSearchPhrase(text);
            searchCourses(text);
          }}
          focused={focused}
          setFocused={setFocused}
        />
      </View>
      <ScrollView
        style={{ backgroundColor: Colors[colorScheme].background }}
        contentContainerStyle={{ alignItems: "center" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={AppStyles.section}>
          <TabView tabs={tabs} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
