import AddCourse from "../screens/AddCourse";
import Course from "../screens/Course";
import CourseSimilarity from "../screens/CourseSimilarity";
import EditCourse from "../screens/EditCourse";
import Enrollments from "../screens/Enrollments";
import Favorites from "../screens/Favorites";
import FriendProfile from "../screens/FriendProfile";
import Friends from "../screens/Friends";
import { FontAwesome } from "../components/Themed";
import Layout from "../constants/Layout";
import MyFriends from "../screens/MyFriends";
import Notifications from "../screens/Notifications";
import { Pressable } from "react-native";
import Profile from "../screens/Profile";
import { ProfileStackScreenProps } from "../types";
import Quarters from "../screens/Quarters";
import Settings from "../screens/Settings";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function NotificationStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Notifications">
      <Stack.Screen
        name="Notifications"
        component={Notifications}
        getId={() => new Date().getTime().toString()}
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
        getId={() => new Date().getTime().toString()}
      />
      <Stack.Screen name="Enrollments" component={Enrollments} />
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
    </Stack.Navigator>
  );
}
