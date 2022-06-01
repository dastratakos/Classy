import * as React from "react";

import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { RootStackParamList, RootTabParamList } from "../types";

import AuthStackNavigator from "./AuthStackNavigator";
import { ColorSchemeName } from "react-native";
import Colors from "../constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import HomeStackNavigator from "./HomeStackNavigator";
import LinkingConfiguration from "./LinkingConfiguration";
import ManageAccount from "../screens/ManageAccount";
import NotificationStackNavigator from "./NotificationStackNavigator";
import ProfileStackNavigator from "./ProfileStackNavigator";
import SearchStackNavigator from "./SearchStackNavigator";
import SelectColor from "../screens/SelectColor";
import SelectQuarter from "../screens/SelectQuarter";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import useColorScheme from "../hooks/useColorScheme";
import Layout from "../constants/Layout";
import AddDegree from "../screens/AddDegree";
import EditDegree from "../screens/EditDegree";

/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AuthStack"
        component={AuthStackNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Root"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Group
        screenOptions={{ presentation: "modal", gestureEnabled: false }}
      >
        <Stack.Screen
          name="ManageAccount"
          component={ManageAccount}
          options={{ title: "Manage Account" }}
        />
        <Stack.Screen
          name="SelectQuarter"
          component={SelectQuarter}
          options={{ title: "Select Quarter" }}
        />
        <Stack.Screen
          name="SelectColor"
          component={SelectColor}
          options={{ title: "Select Color" }}
        />
        <Stack.Screen
          name="AddDegree"
          component={AddDegree}
          options={{ title: "Add Degree" }}
        />
        <Stack.Screen
          name="EditDegree"
          component={EditDegree}
          getId={() => new Date().getTime().toString()}
          options={{ title: "Edit Degree" }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="ProfileStack"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}
    >
      <BottomTab.Screen
        name="HomeStack"
        component={HomeStackNavigator}
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="SearchStack"
        component={SearchStackNavigator}
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="search" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="NotificationStack"
        component={NotificationStackNavigator}
        options={{
          title: "Notifications",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="bell" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="ProfileStack"
        component={ProfileStackNavigator}
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return (
    <FontAwesome
      size={Layout.icon.large}
      style={{ marginBottom: -3, marginHorizontal: -3 }}
      {...props}
    />
  );
}
