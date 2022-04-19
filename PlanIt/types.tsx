/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Login: undefined;
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Settings: undefined;
  NotFound: undefined;

  Courses: undefined;
  Course: undefined;
  Friends: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  Messages: undefined;
  Search: undefined;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList> | undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type ProfileStackParamList = {
  Profile: undefined;
  Courses: undefined;
  Course: undefined;
  Friends: undefined;
  // FriendProfile: undefined;

  Settings: undefined;
};

export type ProfileStackScreenProps<
  Screen extends keyof ProfileStackParamList
> = NativeStackScreenProps<ProfileStackParamList>;
