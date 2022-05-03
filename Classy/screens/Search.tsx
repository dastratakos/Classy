import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, RefreshControl } from "react-native";
import { Text, View } from "../components/Themed";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import SearchBar from "../components/SearchBar";
import useColorScheme from "../hooks/useColorScheme";
import Layout from "../constants/Layout";
import TabView from "../components/TabView";
import CourseList from "../components/CourseList";
import FriendList from "../components/FriendList";

export default function Search() {
  const context = useContext(AppContext);
  const colorScheme = useColorScheme();

  const [searchPhrase, setSearchPhrase] = useState("");
  const [focused, setFocused] = useState(false);
  const [peopleSearchResults, setPeopleSearchResults] = useState([]);
  const [courseSearchResults, setCourseSearchResults] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    searchDb(searchPhrase);
  }, []);

  const searchDb = async (search: string) => {
    // TODO: use search queries
    // TODO: pagination
    // const q = query(
    //   collection(db, "users"),
    //   where("keywords", "array-contains", search)
    // );
    const q = query(collection(db, "users"));

    const people = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (doc.id !== context.user.id) people.push(doc.data());
    });
    setPeopleSearchResults([...people]);

    const q2 = query(collection(db, "courses"));

    const courses = [];
    const querySnapshot2 = await getDocs(q2);
    querySnapshot2.forEach((doc) => {
      courses.push(doc.data());
    });
    setCourseSearchResults([...courses]);

    // console.log("people:", people)
    // console.log("courses:", courses)
  };

  const onRefresh = async () => {
    setRefreshing(true);
    searchDb(searchPhrase);
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
          setSearchPhrase={setSearchPhrase}
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
