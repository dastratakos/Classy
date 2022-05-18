import { ActivityIndicator, View } from "../components/Themed";
import { FriendsProps, User } from "../types";
import { ScrollView, StyleSheet } from "react-native";
import { useEffect, useState } from "react";

import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import FriendList from "../components/Lists/FriendList";
import { getFriendIds, getFriendsFromIds } from "../services/friends";

export default function Friends({ route }: FriendsProps) {
  const colorScheme = useColorScheme();

  const [friends, setFriends] = useState<User[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadScreen = async () => {
      const friendIds = await getFriendIds(route.params.id);
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
