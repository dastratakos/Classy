import { Channel, MessageInput, MessageList } from "stream-chat-expo";

import { Text } from "../components/Themed";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/core";
import AppContext from "../context/Context";
import { useContext, useEffect } from "react";

export default function ChannelScreen() {
  const context = useContext(AppContext);
  const navigation = useNavigation();

  useEffect(() => {
    const getState = async () => {
      const state = await context.channel.watch();
      // console.log("members:", state.members);
      const filteredMembers = state.members.filter(
        (member) => member.user?.id !== context.user.id
      );
      if (filteredMembers.length === 1) {
        context.setChannelName(filteredMembers[0].user.name);
      }
    };

    getState();
  }, []);

  return (
    <Channel
      channel={context.channel}
      hideStickyDateHeader
    >
      <MessageList
        onThreadSelect={(thread) => {
          context.setThread(thread);
          navigation.navigate("Thread", { id: context.channel.id });
        }}
      />
      <MessageInput />
    </Channel>
  );
}

const styles = StyleSheet.create({});