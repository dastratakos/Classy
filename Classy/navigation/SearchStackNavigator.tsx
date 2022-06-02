import * as React from "react";

import AddCourse from "../screens/AddCourse";
import Course from "../screens/Course";
import CourseSimilarity from "../screens/CourseSimilarity";
import EditCourse from "../screens/EditCourse";
import Enrollments from "../screens/Enrollments";
import Favorites from "../screens/Favorites";
import { FontAwesome } from "../components/Themed";
import FriendProfile from "../screens/FriendProfile";
import Friends from "../screens/Friends";
import FullCalendar from "../screens/FullCalendar";
import Layout from "../constants/Layout";
import { Pressable } from "react-native";
import Profile from "../screens/Profile";
import { ProfileStackScreenProps } from "../types";
import Quarters from "../screens/Quarters";
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
        getId={() => new Date().getTime().toString()}
      />
      <Stack.Screen
        name="Enrollments"
        component={Enrollments}
        getId={() => new Date().getTime().toString()}
        options={{ title: "Courses" }}
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
        options={{ title: "Edit Course" }}
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
        name="Quarters"
        component={Quarters}
        getId={() => new Date().getTime().toString()}
        options={{ title: "Quarters" }}
      />
      <Stack.Screen
        name="FullCalendar"
        component={FullCalendar}
        getId={() => new Date().getTime().toString()}
        options={{ title: "Full Calendar" }}
      />
    </Stack.Navigator>
  );
}
