import * as Haptics from "expo-haptics";

import { RefreshControl, ScrollView, StyleSheet } from "react-native";
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
import SelectableFriendCard from "../components/SelectableFriendCard";
import SimpleSearchBar from "../components/SimpleSearchBar";
import { View } from "../components/Themed";
import { db } from "../firebase";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import Button from "../components/Buttons/Button";
import Layout from "../constants/Layout";
import { getChannelId, getNewGroupChatId } from "../services/messages";

export default function NewMessage() {
  const context = useContext(AppContext);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const [searchPhrase, setSearchPhrase] = useState("");
  const [focused, setFocused] = useState(false);
  const [members, setMembers] = useState({});
  const [peopleSearchResults, setPeopleSearchResults] = useState([]);

  const [refreshing, setRefreshing] = useState(false);
  const [chatButtonLoading, setChatButtonLoading] = useState(false);

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

    navigation.popToTop();
    navigation.navigate("ChannelScreen");
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={AppStyles.section}>
        <SimpleSearchBar
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
        <View style={[AppStyles.section, { alignItems: "center" }]}>
          <View style={{ width: "50%", marginBottom: Layout.spacing.medium }}>
            <Button
              text="Chat"
              onPress={handleChatPressed}
              loading={chatButtonLoading}
              disabled={Object.keys(members).length === 0}
              emphasized
            />
          </View>
          {searchPhrase === "" ? (
            <>
              {Object.values(members).map((friend) => (
                <SelectableFriendCard
                  friend={friend}
                  onPress={() => handleFriendPressed(friend)}
                  selected={friend.id in members}
                  key={friend.id}
                />
              ))}
            </>
          ) : (
            <>
              {peopleSearchResults.map((friend) => (
                <SelectableFriendCard
                  friend={friend}
                  onPress={() => handleFriendPressed(friend)}
                  selected={friend.id in members}
                  key={friend.id}
                />
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({});
