import * as React from "react";

import AddEditCourse from "../screens/AddEditCourse";
import AppContext from "../context/Context";
import ChannelDetails from "../screens/ChannelDetails";
import ChannelScreen from "../screens/ChannelScreen";
import Course from "../screens/Course";
import CourseSimilarity from "../screens/CourseSimilarity";
import Courses from "../screens/Courses";
import FriendProfile from "../screens/FriendProfile";
import Friends from "../screens/Friends";
import { Icon } from "../components/Themed";
import Messages from "../screens/Messages";
import { MessagesStackScreenProps } from "../types";
import NewMessage from "../screens/NewMessage";
import { Pressable } from "react-native";
import Profile from "../screens/Profile";
import ThreadScreen from "../screens/ThreadScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import MyFriends from "../screens/MyFriends";
import MyQuarters from "../screens/MyQuarters";

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
          title: context.channelName,
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
      <Stack.Screen
        name="Profile"
        component={Profile}
        getId={() => new Date().getTime().toString()}
      />
      <Stack.Screen
        name="Courses"
        component={Courses}
        getId={() => new Date().getTime().toString()}
      />
      <Stack.Screen
        name="Course"
        component={Course}
        getId={() => new Date().getTime().toString()}
      />
      <Stack.Screen
        name="AddEditCourse"
        component={AddEditCourse}
        options={{ title: "Add or Edit Course" }}
      />
      <Stack.Screen
        name="MyFriends"
        component={MyFriends}
        getId={() => new Date().getTime().toString()}
        options={{ title: "Friends" }}
      />
      <Stack.Screen
        name="Friends"
        component={Friends}
        getId={() => new Date().getTime().toString()}
      />
      <Stack.Screen
        name="FriendProfile"
        component={FriendProfile}
        getId={() => new Date().getTime().toString()}
        options={{ title: "Friend Profile" }}
      />
      <Stack.Screen
        name="CourseSimilarity"
        component={CourseSimilarity}
        getId={() => new Date().getTime().toString()}
        options={{ title: "Course Similarity" }}
      />
      <Stack.Screen
        name="MyQuarters"
        component={MyQuarters}
        options={{ title: "Quarters" }}
      />
    </Stack.Navigator>
  );
}
