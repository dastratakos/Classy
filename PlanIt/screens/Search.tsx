import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, RefreshControl } from "react-native";
import { Text, View } from "../components/Themed";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import FriendCard from "../components/FriendCard";
import SearchBar from "../components/SearchBar";
import useColorScheme from "../hooks/useColorScheme";
import Layout from "../constants/Layout";
import CourseCard from "../components/CourseCard";

export default function Search() {
  const context = useContext(AppContext);
  const colorScheme = useColorScheme();

  const [searchPhrase, setSearchPhrase] = useState("");
  const [focused, setFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

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

    const results = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (doc.id !== context.user.id) results.push(doc.data());
    });
    // setSearchResults(results);

    const q2 = query(collection(db, "courses"));

    const results2 = [];
    const querySnapshot2 = await getDocs(q2);
    querySnapshot2.forEach((doc) => {
      results2.push(doc.data());
    });
    setSearchResults([...results, ...results2]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    searchDb(searchPhrase);
    setRefreshing(false);
  };

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
      {/* <View style={{ height: Layout.spacing.medium }} /> */}
      <ScrollView
        style={{ backgroundColor: Colors[colorScheme].background }}
        contentContainerStyle={{ alignItems: "center" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={AppStyles.section}>
          {searchResults.map((result, i) => {
            if (result.id) {
              return (
                <FriendCard
                  id={result.id}
                  name={result.name}
                  major={result.major}
                  gradYear={result.gradYear}
                  photoUrl={result.photoUrl}
                  key={result.id}
                />
              );
            }

            return (
              <CourseCard
                course={result}
                // numFriends={result.numFriends}
                numFriends={"0"}
                // emphasize={result.taking}
                emphasize={false}
                key={result.courseId}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
