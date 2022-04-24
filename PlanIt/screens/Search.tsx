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
    setSearchResults(results);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    searchDb(searchPhrase);
    setRefreshing(false);
  };

  return (
    <View style={[AppStyles.section, { flex: 1 }]}>
      <SearchBar
        placeholder="Search courses or people..."
        searchPhrase={searchPhrase}
        setSearchPhrase={setSearchPhrase}
        focused={focused}
        setFocused={setFocused}
      />
      <View style={{ height: Layout.spacing.medium }} />
      <ScrollView
        style={{ backgroundColor: Colors[colorScheme].background }}
        contentContainerStyle={{ alignItems: "center" }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {searchResults.map((friend, i) => (
          <FriendCard
            id={friend.id}
            name={friend.name}
            major={friend.major}
            gradYear={friend.gradYear}
            photoUrl={friend.photoUrl}
            key={i}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
