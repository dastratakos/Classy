import * as React from "react";

import AddEditCourse from "../screens/AddEditCourse";
import Course from "../screens/Course";
import CourseSimilarity from "../screens/CourseSimilarity";
import Courses from "../screens/Courses";
import Favorites from "../screens/Favorites";
import FriendProfile from "../screens/FriendProfile";
import Friends from "../screens/Friends";
import { Icon } from "../components/Themed";
import Layout from "../constants/Layout";
import MyFriends from "../screens/MyFriends";
import MyQuarters from "../screens/MyQuarters";
import { Pressable } from "react-native";
import Profile from "../screens/Profile";
import { ProfileStackScreenProps } from "../types";
import Search from "../screens/Search";
import Settings from "../screens/Settings";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function SearchStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Search">
      <Stack.Screen name="Search" component={Search} />
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
        options={{ title: "Friend Profile" }}
        getId={() => new Date().getTime().toString()}
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
