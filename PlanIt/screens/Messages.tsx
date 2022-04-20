import {
  Channel,
  ChannelList,
  Chat,
  MessageInput,
  MessageList,
  OverlayProvider,
} from "stream-chat-expo";
import type { DeepPartial, Theme } from "stream-chat-expo";
import { Icon, Text, View } from "../components/Themed";
import { useEffect, useState } from "react";

import { StreamChat } from "stream-chat";
import { Pressable, StyleSheet } from "react-native";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";

const STREAM_API_KEY = "y9tk9hsvsxqa";
const client = StreamChat.getInstance(STREAM_API_KEY);

const user = {
  id: "dean",
  name: "Dean Stratakos",
};
// const user = {
//   id: "grace",
//   name: "Grace Alwan",
// };

export default function Messages() {
  const navigation = useNavigation();

  const colorScheme = useColorScheme();

  const getTheme = (): DeepPartial<Theme> => ({
    colors: {
      accent_blue: "#005FFF",
      accent_green: "#20E070",
      accent_red: "#FF3742",
      bg_gradient_end: "#F7F7F7",
      bg_gradient_start: "#FCFCFC",
      black: Colors[colorScheme].text,
      blue_alice: "#E9F2FF",
      border: "#00000014", // 14 = 8% opacity; top: x=0, y=-1; bottom: x=0, y=1
      grey: "#7A7A7A",
      grey_dark: "#72767E",
      grey_gainsboro: Colors[colorScheme].tertiaryBackground,
      grey_whisper: "#ECEBEB",
      icon_background: "#FFFFFF",
      label_bg_transparent: "#00000033", // 33 = 20% opacity
      modal_shadow: "#00000099", // 99 = 60% opacity; x=0, y= 1, radius=4
      // overlay: `#${Colors[colorScheme].text}CC`, // CC = 80% opacity
      overlay: Colors[colorScheme].text,
      shadow_icon: "#00000040", // 40 = 25% opacity; x=0, y=0, radius=4
      targetedMessageBackground: "#FBF4DD", // dark mode = #302D22
      transparent: "transparent",
      white: Colors[colorScheme].background,
      white_smoke: "#F2F2F2",
      white_snow: Colors[colorScheme].background,
    },
  });
  const [theme, setTheme] = useState(getTheme());

  useEffect(() => {
    setTheme(getTheme());
  }, [colorScheme]);

  const [isReady, setIsReady] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<any>(null);

  useEffect(() => {
    const connectUser = async () => {
      await client.connectUser(user, client.devToken(user.id));
      console.log("User connected");

      // Create a channel
      const channel = client.channel("messaging", "cs194w-team4", {
        name: "CS 194W Team 4",
      });
      // await channel.addMembers(["grace"], {
      //   text: "Grace Alwan joined the channel.",
      //   user_id: "grace",
      // });
      // const channel = client.channel("messaging", "cs194w-team4");
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
            <MessageList />
            <MessageInput />
            <Pressable
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.5 : 1,
                },
                StyleSheet.absoluteFill,
                styles.backContainer,
              ]}
              onPress={() => setSelectedChannel(null)}
            >
              <Icon
                name="angle-left"
                size={25}
                lightColor={Colors.light.tint}
                darkColor={Colors.light.tint}
              />
              <Text style={[styles.back, { color: Colors.light.tint }]}>
                Back
              </Text>
            </Pressable>
          </Channel>
        ) : (
          <ChannelList onSelect={onChannelPressed} />
        )}
      </Chat>
    </OverlayProvider>
  );
}

const styles = StyleSheet.create({
  backContainer: {
    alignSelf: "flex-start",
    height: 50,
    width: 75,
    padding: Layout.spacing.small,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  back: {
    fontSize: Layout.text.large,
  },
});
