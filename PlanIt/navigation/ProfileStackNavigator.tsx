import * as React from "react";

import { ColorSchemeName, Pressable } from "react-native";

import Colors from "../constants/Colors";
import Course from "../screens/Course";
import Courses from "../screens/Courses";
import { FontAwesome } from "@expo/vector-icons";
import FriendProfile from "../screens/FriendProfile";
import Friends from "../screens/Friends";
import Profile from "../screens/Profile";
import { ProfileStackScreenProps } from "../types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import useColorScheme from "../hooks/useColorScheme";

const Stack = createNativeStackNavigator();

export default function ProfileStackNavigator() {
  const colorScheme = useColorScheme();

  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={({ navigation }: ProfileStackScreenProps<"Profile">) => ({
          title: "Profile",
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate("Settings")}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <FontAwesome
                name="gear"
                size={25}
                color={Colors[colorScheme].text}
              />
            </Pressable>
          ),
        })}
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
