import { FlatList, StyleSheet } from "react-native";
import { FriendsProps, User } from "../types";
import { useContext, useEffect, useState } from "react";

import { ActivityIndicator, View } from "../components/Themed";
import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import EmptyList from "../components/EmptyList";
import FriendCard from "../components/Cards/FriendCard";
import SVGNoFriends from "../assets/images/undraw/noFriends.svg";
import { getFriendsFromIds } from "../services/friends";
import useColorScheme from "../hooks/useColorScheme";
import TabView from "../components/TabView";
import Layout from "../constants/Layout";

export default function Friends({ route }: FriendsProps) {
  const context = useContext(AppContext);
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

  if (route.params.id === context.user.id)
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

  const tabs = [
    {
      label: "All",
      component: (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FriendCard friend={item} showFriendStatus />
          )}
          contentContainerStyle={{
            ...AppStyles.section,
            backgroundColor: Colors[colorScheme].background,
          }}
          style={{ backgroundColor: Colors[colorScheme].background }}
          ListEmptyComponent={
            <EmptyList SVGElement={SVGNoFriends} primaryText="No friends yet" />
          }
        />
      ),
    },
    {
      label: "Mutual",
      component: (
        <FlatList
          data={friends.filter((f: User) => context.friendIds.includes(f.id))}
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
      ),
    },
  ];

  return (
    <View style={{ flex: 1, paddingTop: Layout.spacing.medium }}>
      <TabView
        tabs={tabs}
        addTabMargin
        selectedStyle={{ backgroundColor: Colors.pink }}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
