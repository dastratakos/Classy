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
import FriendList from "../components/Lists/FriendList";
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
      component: (
        <FriendList
          friends={friends}
          emptyPrimary="No friends yet"
          emptySecondary="Find friends in the Search tab!"
          requests={false}
        />
      ),
    },
    {
      label: "Requests",
      component: (
        <FriendList
          friends={requests}
          emptyPrimary="No friend requests"
          requests={true}
        />
      ),
    },
  ];

  return (
    <ScrollView
      style={{ backgroundColor: Colors[colorScheme].background }}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={AppStyles.section}>
        <TabView tabs={tabs} selectedStyle={{ backgroundColor: Colors.pink }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
