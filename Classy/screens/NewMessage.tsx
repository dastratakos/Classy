import * as Haptics from "expo-haptics";

import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { getChannelId, getNewGroupChatId } from "../services/messages";
import { searchMoreUsers, searchUsers } from "../services/users";
import { useContext, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import Colors from "../constants/Colors";
import EmptyList from "../components/EmptyList";
import Layout from "../constants/Layout";
import SVGVoid from "../assets/images/undraw/void.svg";
import SVGChat from "../assets/images/undraw/groupChat.svg";
import SelectableFriendCard from "../components/Cards/SelectableFriendCard";
import SimpleSearchBar from "../components/SimpleSearchBar";
import { User } from "../types";
import { Text, View } from "../components/Themed";
import { db } from "../firebase";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function NewMessage() {
  const context = useContext(AppContext);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const [searchPhrase, setSearchPhrase] = useState("");
  const [focused, setFocused] = useState(false);
  const [members, setMembers] = useState({});

  const [userSearchResults, setUserSearchResults] = useState<User[]>([]);
  const [showFullUserResults, setShowFullUserResults] =
    useState<boolean>(false);
  const [lastUser, setLastUser] = useState<User>({} as User);
  const [usersRefreshing, setUsersRefreshing] = useState<boolean>(false);
  const [stopUserSearch, setStopUserSearch] = useState<boolean>(false);

  const [chatButtonLoading, setChatButtonLoading] = useState(false);

  const handleSearchUsers = async (search: string) => {
    setUsersRefreshing(true);

    if (search === "") {
      setUserSearchResults([]);
      setUsersRefreshing(false);
      return;
    }

    let { users, lastVisible } = await searchUsers(context.user.id, search);
    setUserSearchResults([...users]);

    console.log("users.length =", users.length);

    setLastUser(lastVisible);
    setUsersRefreshing(false);
  };

  const handleSearchMoreUsers = async () => {
    if (stopUserSearch) return;

    // setUsersRefreshing(true);

    if (!lastUser) {
      console.log("Searching users:", searchPhrase);
      let { users, lastVisible } = await searchUsers(
        context.user.id,
        searchPhrase,
        10
      );
      setUserSearchResults([...users]);
      setLastUser(lastVisible);

      if (users.length < 10) setStopUserSearch(true);
    } else {
      console.log("Searching more users:", searchPhrase);
      let { users, lastVisible } = await searchMoreUsers(
        context.user.id,
        searchPhrase,
        lastUser
      );
      setUserSearchResults([...userSearchResults, ...users]);
      setLastUser(lastVisible);

      if (users.length < 10) setStopUserSearch(true);
    }

    // setUsersRefreshing(false);
  };

  const handleFriendPressed = (friend) => {
    setSearchPhrase("");
    let newMembers = { ...members };
    if (friend.id in members) {
      delete newMembers[`${friend.id}`];
    } else {
      newMembers[`${friend.id}`] = friend;
    }
    setMembers(newMembers);
  };

  const createDirectMessage = async (friendId: string) => {
    console.log("Creating direct message");

    /**
     * The channelId for a direct message between two people is their user IDs
     * separated by hyphens. The one that comes first alphabetically will be
     * listed first.
     */
    let channelId;
    if (friendId < context.user.id)
      channelId = `${friendId}-${context.user.id}`;
    else channelId = `${context.user.id}-${friendId}`;

    const channel = context.streamClient.channel("messaging", channelId, {
      name: "Direct Message",
      members: [context.user.id, friendId],
    });

    await channel.watch();

    return channel;
  };

  const createGroupChat = async () => {
    console.log("Creating group chat");

    let channelId = await getChannelId(members, context.user.id);

    if (channelId === "") {
      let membersObj = {};
      membersObj[`${context.user.id}`] = true;
      Object.keys(members).forEach((id) => {
        membersObj[`${id}`] = true;
      });

      channelId = await getNewGroupChatId(membersObj);
    }

    const channel = context.streamClient.channel("messaging", channelId, {
      name: "New group chat",
      members: [...Object.keys(members), context.user.id],
    });

    await channel.watch();

    return channel;
  };

  const handleChatPressed = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setChatButtonLoading(true);

    let channel;
    if (Object.keys(members).length === 1) {
      channel = await createDirectMessage(Object.keys(members)[0]);
    } else {
      channel = await createGroupChat();
    }
    context.setChannel(channel);
    context.setChannelName(channel.data.name);

    setChatButtonLoading(false);

    navigation.goBack();
    navigation.navigate("ChannelScreen");
  };

  const MemberList = () => (
    <FlatList
      data={Object.values(members)}
      renderItem={({ item }) => (
        <SelectableFriendCard
          friend={item}
          onPress={() => handleFriendPressed(item)}
          selected={item.id in members}
        />
      )}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: Layout.spacing.medium,
      }}
      ListEmptyComponent={
        usersRefreshing ? (
          <ActivityIndicator />
        ) : (
          <EmptyList
            SVGElement={SVGChat}
            primaryText="Search for people to chat with"
            secondaryText="Create a direct message or a group chat"
          />
        )
      }
    />
  );

  const UserResults = () => (
    <>
      {showFullUserResults ? (
        <FlatList
          data={userSearchResults}
          renderItem={({ item }) => (
            <SelectableFriendCard
              friend={item}
              onPress={() => handleFriendPressed(item)}
              selected={item.id in members}
            />
          )}
          keyExtractor={(item) => item.id}
          onEndReached={() => {
            if (!usersRefreshing) handleSearchMoreUsers();
          }}
          onEndReachedThreshold={0}
          refreshing={usersRefreshing}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: Layout.spacing.medium,
          }}
          ListFooterComponent={
            stopUserSearch ? null : (
              <View
                style={{
                  marginTop: Layout.spacing.small,
                  marginBottom: Layout.spacing.medium,
                }}
              >
                <ActivityIndicator />
              </View>
            )
          }
        />
      ) : (
        <FlatList
          data={userSearchResults}
          renderItem={({ item }) => (
            <SelectableFriendCard
              friend={item}
              onPress={() => handleFriendPressed(item)}
              selected={item.id in members}
            />
          )}
          keyExtractor={(item) => item.id}
          refreshing={usersRefreshing}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: Layout.spacing.medium,
          }}
          ListFooterComponent={
            <>
              {/* Only display if we have at least 3 matching users */}
              {userSearchResults.length === 3 && (
                <TouchableOpacity
                  onPress={() => {
                    handleSearchMoreUsers();
                    setShowFullUserResults(true);
                  }}
                  style={{
                    alignSelf: "center",
                    marginTop: Layout.spacing.small,
                  }}
                >
                  <Text style={{ color: Colors.lightBlue }}>
                    See all results
                  </Text>
                </TouchableOpacity>
              )}
            </>
          }
          ListEmptyComponent={
            usersRefreshing ? (
              <ActivityIndicator />
            ) : (
              <EmptyList
                SVGElement={SVGVoid}
                primaryText={`No matching users for "${searchPhrase}"`}
                secondaryText="Try searching again using a different spelling"
              />
            )
          }
        />
      )}
    </>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ ...AppStyles.section, alignItems: "center" }}>
        <SimpleSearchBar
          placeholder="Search people..."
          searchPhrase={searchPhrase}
          onChangeText={(text) => {
            setSearchPhrase(text);
            handleSearchUsers(text);
          }}
          focused={focused}
          setFocused={setFocused}
        />
        <View style={{ width: "50%", marginTop: Layout.spacing.medium }}>
          <Button
            text="Chat"
            onPress={handleChatPressed}
            loading={chatButtonLoading}
            disabled={Object.keys(members).length === 0}
            emphasized
          />
        </View>
      </View>
      {searchPhrase === "" ? <MemberList /> : <UserResults />}
    </View>
  );
}

const styles = StyleSheet.create({});
