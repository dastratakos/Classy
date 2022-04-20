import {
  Channel,
  ChannelList,
  Chat,
  MessageInput,
  MessageList,
  OverlayProvider,
} from "stream-chat-expo";
import type { DeepPartial, Theme } from "stream-chat-expo";
import { Text, View } from "../components/Themed";
import { useEffect, useState } from "react";

import Colors from "../constants/Colors";
import EditScreenInfo from "../components/EditScreenInfo";
import { RootTabScreenProps } from "../types";
import { StreamChat } from "stream-chat";
import { StyleSheet } from "react-native";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

const STREAM_API_KEY = "y9tk9hsvsxqa";
const client = StreamChat.getInstance(STREAM_API_KEY);

const user = {
  id: "dean",
  name: "Dean Stratakos",
};

export default function Messages() {
  const navigation = useNavigation();

  const colorScheme = useColorScheme();

  console.log(`Color scheme: ${colorScheme}`);
  // const getTheme = (): DeepPartial<Theme> => ({
  //   colors: { black: Colors[colorScheme].text },
  // });
  const getTheme = (): DeepPartial<Theme> => ({
    // colors: colorScheme === 'dark' ? { black: '#FFFFFF' } : { black: '#000000' },
    colors:
      colorScheme === "dark" ? { black: "#FFFFFF" } : { black: "#FFFFFF" },
  });
  const [theme, setTheme] = useState(getTheme());

  useEffect(() => {
    setTheme(getTheme());
    console.log(`Theme: ${JSON.stringify(theme, null, 2)}`);
  }, [colorScheme]);

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
    <OverlayProvider value={{ style: theme }}>
      <Chat client={client}>
        {/* <ChannelList onSelect={(channel) => navigation.navigate("ChannelScreen")} /> */}
        {selectedChannel ? (
          <Channel channel={selectedChannel}>
            <Text onPress={() => setSelectedChannel(null)}>Back</Text>
            <MessageList />
            <MessageInput />
          </Channel>
        ) : (
          <ChannelList onSelect={onChannelPressed} />
        )}
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
