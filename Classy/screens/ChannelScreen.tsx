import { Channel, MessageInput, MessageList } from "stream-chat-expo";
import { useContext, useEffect } from "react";

import AppContext from "../context/Context";
import { Channel as ChannelType } from "stream-chat";
import Layout from "../constants/Layout";
import ProfilePhoto from "../components/ProfilePhoto";
import { StyleSheet } from "react-native";
import { View } from "../components/Themed";
import { useNavigation } from "@react-navigation/core";

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

  const CustomAvatar = ({ channel }: { channel: ChannelType }) => {
    return (
      <View style={{ marginRight: Layout.spacing.small }}>
        <ProfilePhoto url="" size={Layout.photo.xxsmall} />
      </View>
    );
  };

  return (
    <Channel
      channel={context.channel}
      hideStickyDateHeader
      // MessageAvatar={({ channel }) => <CustomAvatar channel={channel} />}
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
