import { ChannelList } from "stream-chat-expo";
import { StyleSheet } from "react-native";

import { Channel as ChannelType } from "stream-chat";
import { useNavigation } from "@react-navigation/core";

export default function Messages() {
  const navigation = useNavigation();

  return (
    <ChannelList
      onSelect={(channel: ChannelType) => {
        console.log("pressed 1");
        console.log(channel);
        console.log("pressed 2");
        navigation.navigate("ChannelScreen", { channel });
      }}
    />
  );
}

const styles = StyleSheet.create({});
