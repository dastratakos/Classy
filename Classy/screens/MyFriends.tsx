import { ActivityIndicator, View } from "../components/Themed";
import { ScrollView, StyleSheet } from "react-native";
import {
  getFriendIds,
  getFriendsFromIds,
  getRequestIds,
} from "../services/friends";
import { useContext, useEffect, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import FriendList from "../components/FriendList";
import TabView from "../components/TabView";
import { User } from "../types";
import useColorScheme from "../hooks/useColorScheme";

export default function MyFriends() {
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  const [friends, setFriends] = useState([] as User[]);
  const [requests, setRequests] = useState([] as User[]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadScreen = async () => {
      const friendIds = await getFriendIds(context.user.id);
      setFriends(await getFriendsFromIds(friendIds));

      const requestIds = await getRequestIds(context.user.id);
      setRequests(await getFriendsFromIds(requestIds));

      setIsLoading(false);
    };
    loadScreen();
  }, []);

  if (isLoading) return <ActivityIndicator />;

  const tabs = [
    {
      label: "Friends",
      component: <FriendList friends={friends} />,
    },
    {
      label: "Requests",
      component: <FriendList friends={requests} />,
    },
  ];

  return (
    <ScrollView
      style={{ backgroundColor: Colors[colorScheme].background }}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={AppStyles.section}>
        <TabView tabs={tabs} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
