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
import ChannelDetails from "../screens/ChannelDetails";
import NewMessage from "../screens/NewMessage";

const Stack = createNativeStackNavigator();

export default function MessagesStackNavigator() {
  const context = useContext(AppContext);

  return (
    <Stack.Navigator initialRouteName="Messages">
      <Stack.Screen
        name="Messages"
        component={Messages}
        options={({ navigation }: MessagesStackScreenProps<"Messages">) => ({
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("NewMessage")}
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
        options={({ navigation }: MessagesStackScreenProps<"Messages">) => ({
          title: context.channel?.data?.name,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("ChannelDetails")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <Icon name="info-circle" size={25} />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="Thread"
        component={ThreadScreen}
        options={{ title: "Thread" }}
      />
      <Stack.Screen
        name="ChannelDetails"
        component={ChannelDetails}
        options={{ title: "Details" }}
      />
      <Stack.Screen
        name="NewMessage"
        component={NewMessage}
        options={{ title: "New Message" }}
      />
      <Stack.Screen name="Courses" component={Courses} />
      <Stack.Screen name="Course" component={Course} />
      <Stack.Screen name="Friends" component={Friends} />
      <Stack.Screen
        name="FriendProfile"
        component={FriendProfile}
        options={{ title: "Friend Profile" }}
      />
    </Stack.Navigator>
  );
}
