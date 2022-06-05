import * as React from "react";

import { FontAwesome, Text, View } from "../components/Themed";
import { HomeStackScreenProps, ProfileStackScreenProps } from "../types";

import AddCourse from "../screens/AddCourse";
import AppContext from "../context/Context";
import ChannelDetails from "../screens/ChannelDetails";
import ChannelScreen from "../screens/ChannelScreen";
import Colors from "../constants/Colors";
import Course from "../screens/Course";
import CourseSimilarity from "../screens/CourseSimilarity";
import EditCourse from "../screens/EditCourse";
import Enrollments from "../screens/Enrollments";
import Favorites from "../screens/Favorites";
import FriendProfile from "../screens/FriendProfile";
import Friends from "../screens/Friends";
import FullCalendar from "../screens/FullCalendar";
import Home from "../screens/Home";
import Layout from "../constants/Layout";
import Messages from "../screens/Messages";
import NewMessage from "../screens/NewMessage";
import { Pressable } from "react-native";
import Profile from "../screens/Profile";
import Quarters from "../screens/Quarters";
import Settings from "../screens/Settings";
import ThreadScreen from "../screens/ThreadScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  const context = useContext(AppContext);

  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Home}
        options={({ navigation }: HomeStackScreenProps<"Home">) => ({
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("Messages")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <FontAwesome name="comments" size={Layout.icon.medium} />
              {context.totalUnreadCount > 0 && (
                <View
                  style={{
                    backgroundColor: "transparent",
                    height: 20,
                    width: 50,
                    alignItems: "flex-end",
                    justifyContent: "center",
                    position: "absolute",
                    top: -8,
                    right: -8,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: Colors.pink,
                      height: 20,
                      minWidth: 20,
                      paddingHorizontal: 4,
                      borderRadius: 10,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ color: Colors.white }}>
                      {context.totalUnreadCount}
                    </Text>
                  </View>
                </View>
              )}
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="Messages"
        component={Messages}
        options={({ navigation }: HomeStackScreenProps<"Messages">) => ({
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("NewMessage")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <FontAwesome name="edit" size={Layout.icon.medium} />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="ChannelScreen"
        component={ChannelScreen}
        getId={() => new Date().getTime().toString()}
        options={({ navigation }: HomeStackScreenProps<"Messages">) => ({
          title: context.channelName,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("ChannelDetails")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <FontAwesome name="info-circle" size={Layout.icon.medium} />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="Thread"
        component={ThreadScreen}
        getId={({ params }) => params.id + new Date().getTime().toString()}
        options={{ title: "Thread" }}
      />
      <Stack.Screen
        name="ChannelDetails"
        component={ChannelDetails}
        getId={() => new Date().getTime().toString()}
        options={{ title: "Details" }}
      />
      <Stack.Screen
        name="NewMessage"
        component={NewMessage}
        options={{ title: "New Message" }}
        // only 1 in the stack at a time
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        getId={() => new Date().getTime().toString()}
        options={({ navigation }: ProfileStackScreenProps<"Profile">) => ({
          title: "Profile",
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("Favorites")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <FontAwesome name="star" size={Layout.icon.medium} />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="Favorites"
        component={Favorites}
        getId={() => new Date().getTime().toString()}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        // only 1 in the stack at a time
      />
      <Stack.Screen
        name="Enrollments"
        component={Enrollments}
        getId={({ params }) => params.userId + new Date().getTime().toString()}
        options={{ title: "Course" }}
      />
      <Stack.Screen
        name="Course"
        component={Course}
        getId={({ params }) =>
          params.course.courseId.toString() + new Date().getTime().toString()
        }
      />
      <Stack.Screen
        name="AddCourse"
        component={AddCourse}
        options={{ title: "Add Course" }}
        // only 1 in the stack at a time
      />
      <Stack.Screen
        name="EditCourse"
        component={EditCourse}
        options={{ title: "Edit Course" }}
        // only 1 in the stack at a time
      />
      <Stack.Screen
        name="Friends"
        component={Friends}
        getId={({ params }) => params.id + new Date().getTime().toString()}
      />
      <Stack.Screen
        name="FriendProfile"
        component={FriendProfile}
        getId={({ params }) => params.id + new Date().getTime().toString()}
        options={{ title: "Friend Profile" }}
      />
      <Stack.Screen
        name="CourseSimilarity"
        component={CourseSimilarity}
        getId={({ params }) =>
          params.friendId + new Date().getTime().toString()
        }
        options={{ title: "Course Similarity" }}
      />
      <Stack.Screen
        name="Quarters"
        component={Quarters}
        getId={({ params }) => params.user.id + new Date().getTime().toString()}
        options={{ title: "Quarters" }}
      />
      <Stack.Screen
        name="FullCalendar"
        component={FullCalendar}
        getId={({ params }) => params.id + new Date().getTime().toString()}
        options={{ title: "Full Calendar" }}
      />
    </Stack.Navigator>
  );
}
