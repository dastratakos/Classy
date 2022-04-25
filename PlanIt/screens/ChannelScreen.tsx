import { Channel, MessageInput, MessageList } from "stream-chat-expo";

import { StyleSheet } from "react-native";
import { Text } from "../components/Themed";
import { ChannelScreenProps } from "../types";

export default function ChannelScreen({ route }: ChannelScreenProps) {
  console.log(`Channel is`);
  console.log(route.params.channel);
  // console.log(`hello`, JSON.stringify(route.params.channel, null, 2));

  if (!route.params.channel) return <Text>Channel Screen</Text>;

  return (
    <Channel channel={route.params.channel}>
      <MessageList />
      <MessageInput />
    </Channel>
  );
}

const styles = StyleSheet.create({});
