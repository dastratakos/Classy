import { Channel, MessageInput, MessageList } from "stream-chat-expo";

import { StyleSheet } from "react-native";
import { Text } from "../components/Themed";
import { useNavigation } from "@react-navigation/core";
import AppContext from "../context/Context";
import { useContext } from "react";

export default function ChannelScreen() {
  const context = useContext(AppContext);
  const navigation = useNavigation();
  if (!context.channel) return <Text>Channel Screen</Text>;

  return (
    <Channel channel={context.channel}>
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
