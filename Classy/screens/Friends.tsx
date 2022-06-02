import { ActivityIndicator, View } from "../components/Themed";
import { FriendsProps, User } from "../types";
import { ScrollView, StyleSheet } from "react-native";
import { useContext, useEffect, useState } from "react";

import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import FriendList from "../components/Lists/FriendList";
import { getFriendIds, getFriendsFromIds } from "../services/friends";
import AppContext from "../context/Context";

export default function Friends({ route }: FriendsProps) {
  const context = useContext(AppContext);
  const colorScheme = useColorScheme();

  const [friends, setFriends] = useState<User[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadScreen = async () => {
      let friendIds: string[] = [];
      if (route.params.id === context.user.id) friendIds = context.friendIds;
      else friendIds = await getFriendIds(route.params.id);
      
      setFriends(await getFriendsFromIds(friendIds));

      setIsLoading(false);
    };
    loadScreen();
  }, []);

  if (isLoading) return <ActivityIndicator />;

  return (
    <ScrollView
      style={{ backgroundColor: Colors[colorScheme].background }}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={AppStyles.section}>
        <FriendList friends={friends} emptyPrimary="No friends yet" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
