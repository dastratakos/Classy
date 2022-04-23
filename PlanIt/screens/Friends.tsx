import { ScrollView, StyleSheet } from "react-native";
import { ActivityIndicator, Text, View } from "../components/Themed";

import Colors from "../constants/Colors";
import FriendCard from "../components/FriendCard";
import Layout from "../constants/Layout";
import useColorScheme from "../hooks/useColorScheme";
import { useContext, useEffect, useState } from "react";
import AppContext from "../context/Context";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { FriendsProps, User } from "../types";
import AppStyles from "../styles/AppStyles";

export default function Friends({ route }: FriendsProps) {
  const context = useContext(AppContext);
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
      where("ids", "array-contains", id),
      where("status", "==", "friends")
    );
    const friendIds = [] as string[];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const friendId = doc.data().ids.filter((uid: string) => uid !== id)[0];
      friendIds.push(friendId);
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
          <FriendCard
            id={friend.id}
            name={friend.name}
            major={friend.major}
            gradYear={friend.gradYear}
            key={i}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
