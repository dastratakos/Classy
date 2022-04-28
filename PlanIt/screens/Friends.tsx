import { ActivityIndicator, Text, View } from "../components/Themed";
import { FriendsProps, User } from "../types";
import { ScrollView, StyleSheet } from "react-native";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import FriendCard from "../components/FriendCard";
import { db } from "../firebase";
import useColorScheme from "../hooks/useColorScheme";

export default function Friends({ route }: FriendsProps) {
  const colorScheme = useColorScheme();

  const [friends, setFriends] = useState([] as User[]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getFriendIds(route.params.id).then((res) => {
      getFriendsFromIds(res).then((res2) => setFriends(res2));
      setIsLoading(false);
    });
  }, []);

  const getFriendIds = async (id: string) => {
    const q = query(
      collection(db, "friends"),
      where(`ids.${id}`, "==", true),
      where("status", "==", "friends")
    );
    const friendIds = [] as string[];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      for (let key in doc.data().ids) {
        if (key !== id) {
          friendIds.push(key);
          return;
        }
      }
    });
    return friendIds;
  };

  const getUser = async (id: string) => {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as User;
    } else {
      console.log(`Could not find user: ${id}`);
    }
  };

  const getFriendsFromIds = async (friendIds: string[]) => {
    let friendsList = [] as User[];
    let count = 0;

    await new Promise((resolve) => {
      friendIds.forEach((id) => {
        getUser(id).then((res) => {
          if (res) friendsList.push(res);
          count++;
          if (count == friendIds.length) resolve(null);
        });
      });
    });

    friendsList.sort((a, b) =>
      a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1
    );
    return friendsList;
  };

  if (isLoading) return <ActivityIndicator />;

  return (
    <ScrollView
      style={{ backgroundColor: Colors[colorScheme].background }}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={AppStyles.section}>
        {friends.map((friend, i) => (
          <FriendCard friend={friend} key={i} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
