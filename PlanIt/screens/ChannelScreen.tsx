import { Channel, MessageInput, MessageList } from "stream-chat-expo";

import { ChannelSort as ChannelType } from "stream-chat";
import { StreamChatGenerics } from "../types";
import { StyleSheet } from "react-native";
import { Text } from "../components/Themed";

export default function ChannelScreen({
  channel,
}: {
  // channel: ChannelType<StreamChatGenerics>;
  channel: any;
}) {
  console.log(`Channel is ${channel}`);

  if (!channel) return <Text>Channel Screen</Text>;

  return (
    <Channel channel={channel}>
      <MessageList />
      <MessageInput />
    </Channel>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
