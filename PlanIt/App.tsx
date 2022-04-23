import AppContext from "./context/Context";
import Navigation from "./navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import { useState } from "react";
import AppLoading from "expo-app-loading";
import { User } from "./types";

export default function App() {
  /* Global variables. */
  const [user, setUser] = useState({} as User);
  const [friends, setFriends] = useState([] as string[]);
  const [channel, setChannel] = useState(null);
  
  const globalVariables = {
    user: user,
    setUser: setUser,
    friends: friends,
    setFriends: setFriends,
    // channel: channel,
    // setChannel: setChannel,
  };

  // const [userName, setUserName] = useState(profile.name);
  // const [userMajor, setUserMajor] = useState(profile.major);
  // const [userGradYear, setUserGradYear] = useState(profile.gradYear);
  // const [userInterests, setUserInterests] = useState(profile.interests);
  // const [userNumFriends, setUserNumFriends] = useState(profile.numFriends);
  // const [userInClass, setUserInClass] = useState(profile.inClass);
  // const [userPrivate, setUserPrivate] = useState(profile.private);

  // const userSettings = {
  //   userName: userName,
  //   userMajor: userMajor,
  //   userGradYear: userGradYear,
  //   userInterests: userInterests,
  //   userNumFriends: userNumFriends,
  //   userInClass: userInClass,
  //   userPrivate: userPrivate,
  //   setUserName,
  //   setUserMajor,
  //   setUserGradYear,
  //   setUserInterests,
  //   setUserNumFriends,
  //   setUserInClass,
  //   setUserPrivate,
  // };

  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return <AppLoading />;
  } else {
    return (
      <AppContext.Provider value={globalVariables}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </AppContext.Provider>
    );
  }
}
