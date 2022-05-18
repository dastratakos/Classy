import * as React from "react";

import { HomeStackScreenProps, ProfileStackScreenProps } from "../types";
import { Icon, Text, View } from "../components/Themed";

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
import Home from "../screens/Home";
import Layout from "../constants/Layout";
import Messages from "../screens/Messages";
import MyFriends from "../screens/MyFriends";
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
              <Icon name="comments" size={Layout.icon.medium} />
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
              <Icon name="edit" size={Layout.icon.medium} />
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
              <Icon name="info-circle" size={Layout.icon.medium} />
            </Pressable>
          ),
        })}
      />
      <Stack.Screen
        name="Thread"
        component={ThreadScreen}
        getId={() => new Date().getTime().toString()}
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
              <Icon name="star" size={Layout.icon.medium} />
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
        getId={() => new Date().getTime().toString()}
      />
      <Stack.Screen
        name="Enrollments"
        component={Enrollments}
        getId={() => new Date().getTime().toString()}
      />
      <Stack.Screen
        name="Course"
        component={Course}
        getId={() => new Date().getTime().toString()}
      />
      <Stack.Screen
        name="AddCourse"
        component={AddCourse}
        options={{ title: "Add Course" }}
      />
      <Stack.Screen
        name="EditCourse"
        component={EditCourse}
        options={{ title: " Edit Course" }}
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
        name="Quarters"
        component={Quarters}
        getId={() => new Date().getTime().toString()}
        options={{ title: "Quarters" }}
      />
    </Stack.Navigator>
  );
}
