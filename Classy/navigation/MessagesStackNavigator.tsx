import * as React from "react";

import { ColorSchemeName, Pressable } from "react-native";

import AppContext from "../context/Context";
import ChannelScreen from "../screens/ChannelScreen";
import Colors from "../constants/Colors";
import Course from "../screens/Course";
import Courses from "../screens/Courses";
import FriendProfile from "../screens/FriendProfile";
import Friends from "../screens/Friends";
import ThreadScreen from "../screens/ThreadScreen";
import { Icon } from "../components/Themed";
import Messages from "../screens/Messages";
import { MessagesStackScreenProps } from "../types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";

const Stack = createNativeStackNavigator();

export default function MessagesStackNavigator() {
  const context = useContext(AppContext);

  return (
    <Stack.Navigator initialRouteName="Messages">
      <Stack.Screen
        name="Messages"
        component={Messages}
        options={({ navigation }: MessagesStackScreenProps<"Messages">) => ({
          title: context.channel?.data?.name,
          headerRight: () => (
            <Pressable
              onPress={() => console.log("New Message pressed")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <Icon name="edit" size={25} />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="ChannelScreen"
        component={ChannelScreen}
        options={{ title: "Channel" }}
      />
      <Stack.Screen
        name="Thread"
        component={ThreadScreen}
        options={{ title: "Thread" }}
      />
      {/* <Stack.Screen name="Courses" component={Courses} />
      <Stack.Screen name="Course" component={Course} />
      <Stack.Screen name="Friends" component={Friends} /> */}
      <Stack.Screen
        name="FriendProfile"
        component={FriendProfile}
        options={{ title: "Friend Profile" }}
      />
    </Stack.Navigator>
  );
}
