import { ScrollView, StyleSheet } from "react-native";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useContext, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import FriendList from "../components/FriendList";
import SearchBar from "../components/SearchBar";
import { View } from "../components/Themed";
import { db } from "../firebase";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function NewMessage() {
  const context = useContext(AppContext);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const [searchPhrase, setSearchPhrase] = useState("");
  const [focused, setFocused] = useState(false);
  const [peopleSearchResults, setPeopleSearchResults] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  const searchPeople = async (search: string) => {
    if (search === "") {
      setPeopleSearchResults([]);
      return;
    }

    // TODO: pagination
    const q = query(
      collection(db, "users"),
      where("keywords", "array-contains", search.toLowerCase()),
      orderBy("name"),
      limit(3)
    );

    const people = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (doc.id !== context.user.id) people.push(doc.data());
    });
    setPeopleSearchResults([...people]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    searchPeople(searchPhrase);
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={AppStyles.section}>
        <SearchBar
          placeholder="Search people..."
          searchPhrase={searchPhrase}
          onChangeText={(text) => {
            setSearchPhrase(text);
            searchPeople(text);
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
          <FriendList friends={peopleSearchResults} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
