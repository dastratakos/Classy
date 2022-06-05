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
import Toast, { BaseToast } from "react-native-toast-message";
import { Enrollment, FavoritedCourse, User } from "./types";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";

const STREAM_API_KEY = "y9tk9hsvsxqa";

export default function App() {
  /* Global state. */

  // Firestore
  const [user, setUser] = useState<User>({} as User);
  const [friendIds, setFriendIds] = useState<string[]>([]);
  const [requestIds, setRequestIds] = useState<string[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [history, setHistory] = useState<History>({} as History);
  const [favorites, setFavorites] = useState<FavoritedCourse[]>([]);

  // StreamChat
  const [streamClient, setStreamClient] = useState(
    StreamChat.getInstance(STREAM_API_KEY)
  );
  const [channel, setChannel] = useState();
  const [channelName, setChannelName] = useState<string>("");
  const [thread, setThread] = useState();
  const [totalUnreadCount, setTotalUnreadCount] = useState<number>();

  // Modal selections
  const [selectedTerm, setSelectedTerm] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [editDegreeIndex, setEditDegreeIndex] = useState<number>(0);

  const globalVariables = {
    // Firestore
    user,
    setUser,
    friendIds,
    setFriendIds,
    requestIds,
    setRequestIds,
    enrollments,
    setEnrollments,
    history,
    setHistory,
    favorites,
    setFavorites,

    // StreamChat
    streamClient,
    setStreamClient,
    channel,
    setChannel,
    channelName,
    setChannelName,
    thread,
    setThread,
    totalUnreadCount,
    setTotalUnreadCount,

    // Modal selections
    selectedTerm,
    setSelectedTerm,
    selectedColor,
    setSelectedColor,
    editDegreeIndex,
    setEditDegreeIndex,
  };

  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const theme: DeepPartial<Theme> = {
    colors: {
      accent_blue: Colors.light.tint,
      accent_green: Colors.green,
      accent_red: Colors.pink,
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
      overlay: Colors[colorScheme].overlay,
      shadow_icon: "#00000040", // 40 = 25% opacity; x=0, y=0, radius=4
      targetedMessageBackground: "#FBF4DD", // dark mode = #302D22
      transparent: "transparent",
      white: Colors[colorScheme].background,
      white_smoke: "#F2F2F2",
      white_snow: Colors[colorScheme].background,
    },
  };

  const toastConfig = {
    info: (props: object) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: Colors.light.tint }}
        contentContainerStyle={{
          backgroundColor: Colors[colorScheme].cardBackground,
        }}
        text1Style={{ color: Colors[colorScheme].text }}
      />
    ),
  };

  useEffect(() => {
    return () => streamClient.disconnectUser();
  }, []);

  if (!isLoadingComplete) {
    return <AppLoading />;
  } else {
    return (
      <OverlayProvider value={{ style: theme }}>
        <Chat client={streamClient}>
          <AppContext.Provider value={globalVariables}>
            <SafeAreaProvider>
              <Navigation colorScheme={colorScheme} />
              <Toast config={toastConfig} />
              <StatusBar />
            </SafeAreaProvider>
          </AppContext.Provider>
        </Chat>
      </OverlayProvider>
    );
  }
}
