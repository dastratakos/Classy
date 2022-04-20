import {
  Channel,
  ChannelList,
  Chat,
  MessageInput,
  MessageList,
  OverlayProvider,
} from "stream-chat-expo";
import { Text, View } from "../components/Themed";
import { useEffect, useState } from "react";

import EditScreenInfo from "../components/EditScreenInfo";
import { RootTabScreenProps } from "../types";
import { StreamChat } from "stream-chat";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/core";

const STREAM_API_KEY = "y9tk9hsvsxqa";
const client = StreamChat.getInstance(STREAM_API_KEY);

const user = {
  id: "dean",
  name: "Dean Stratakos",
};

export default function Messages() {
  const navigation = useNavigation();

  const [isReady, setIsReady] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<any>(null);

  useEffect(() => {
    const connectUser = async () => {
      await client.connectUser(user, client.devToken(user.id));
      console.log("User connected");

      // Create a channel
      const channel = client.channel("messaging", "cs194w", {
        name: "CS 194W",
      });
      await channel.watch();
      setIsReady(true);
    };

    connectUser();

    return () => client.disconnectUser();
  }, []);

  if (!isReady) return null;

  const onChannelPressed = (channel) => {
    setSelectedChannel(channel);
  };

  return (
    <OverlayProvider>
      <Chat client={client}>
        <ChannelList
          onSelect={(channel) => {
            console.log(`In Messages, Channel is ${channel}`);

            navigation.navigate("ChannelScreen", { channel });
          }}
        />
        {/* <ChannelList onSelect={(channel) => navigation.navigate("ChannelScreen")} /> */}
      </Chat>
    </OverlayProvider>
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
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
