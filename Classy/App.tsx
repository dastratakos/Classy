import { Chat, OverlayProvider } from "stream-chat-expo";
import type { DeepPartial, Theme } from "stream-chat-expo";
import { useEffect, useState } from "react";

import AppContext from "./context/Context";
import AppLoading from "expo-app-loading";
import Colors from "./constants/Colors";
import Navigation from "./navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { StreamChat } from "stream-chat";
import { User } from "./types";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";

const STREAM_API_KEY = "y9tk9hsvsxqa";
const client = StreamChat.getInstance(STREAM_API_KEY);

export default function App() {
  /* Global variables. */
  const [user, setUser] = useState({} as User);
  const [friendIds, setFriendIds] = useState([] as string[]);
  const [channel, setChannel] = useState();
  const [channelName, setChannelName] = useState();
  const [thread, setThread] = useState();

  const globalVariables = {
    user: user,
    setUser: setUser,
    friendIds: friendIds,
    setFriendIds: setFriendIds,
    channel: channel,
    setChannel: setChannel,
    channelName: channelName,
    setChannelName: setChannelName,
    thread: thread,
    setThread: setThread,
  };

  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const theme: DeepPartial<Theme> = {
    colors: {
      accent_blue: Colors.light.tint,
      accent_green: Colors.green,
      accent_red: Colors.red,
      // bg_gradient_end: "#F7F7F7",
      // bg_gradient_start: "#FCFCFC",
      bg_gradient_end: Colors[colorScheme].background,
      bg_gradient_start: Colors[colorScheme].background,
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
  };

  useEffect(() => {
    return () => client.disconnectUser();
  }, []);

  if (!isLoadingComplete) {
    return <AppLoading />;
  } else {
    return (
      <OverlayProvider value={{ style: theme }}>
        <Chat client={client}>
          <AppContext.Provider value={globalVariables}>
            <SafeAreaProvider>
              <Navigation colorScheme={colorScheme} />
              <StatusBar />
            </SafeAreaProvider>
          </AppContext.Provider>
        </Chat>
      </OverlayProvider>
    );
  }
}
