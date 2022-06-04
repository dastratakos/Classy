import { FlatList, StyleSheet } from "react-native";
import { FriendsProps, User } from "../types";
import { useEffect, useState } from "react";

import { ActivityIndicator } from "../components/Themed";
import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import EmptyList from "../components/EmptyList";
import FriendCard from "../components/Cards/FriendCard";
import SVGNoFriends from "../assets/images/undraw/noFriends.svg";
import { getFriendsFromIds } from "../services/friends";
import useColorScheme from "../hooks/useColorScheme";

export default function Friends({ route }: FriendsProps) {
  const colorScheme = useColorScheme();

  const [friends, setFriends] = useState<User[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadScreen = async () => {
      setFriends(await getFriendsFromIds(route.params.friendIds));

      setIsLoading(false);
    };
    loadScreen();
  }, []);

  if (isLoading) return <ActivityIndicator />;

  return (
    <FlatList
      data={friends}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <FriendCard friend={item} />}
      contentContainerStyle={{
        ...AppStyles.section,
        backgroundColor: Colors[colorScheme].background,
      }}
      style={{ backgroundColor: Colors[colorScheme].background }}
      ListEmptyComponent={
        <EmptyList SVGElement={SVGNoFriends} primaryText="No friends yet" />
      }
    />
  );
}

const styles = StyleSheet.create({});
