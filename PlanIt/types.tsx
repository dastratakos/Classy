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
  AuthStack: NavigatorScreenParams<RootTabParamList> | undefined;
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Settings: undefined;
  NotFound: undefined;

  Login: { email?: string } | undefined;
  Register: { email?: string } | undefined;
  ResetPassword: undefined;

  Messages: undefined;
  ChannelScreen: undefined;

  Courses: undefined;
  Course: undefined;
  Friends: undefined;
  FriendProfile: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  MessagesStack: NavigatorScreenParams<MessagesStackParamList> | undefined;
  Search: undefined;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList> | undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type ProfileStackParamList = {
  Settings: undefined;

  Profile: undefined;
  Courses: undefined;
  Course: undefined;
  Friends: undefined;
  FriendProfile: undefined;
};

export type ProfileStackScreenProps<
  Screen extends keyof ProfileStackParamList
> = NativeStackScreenProps<ProfileStackParamList>;

export type MessagesStackParamList = {
  Settings: undefined;

  Messages: undefined;
  ChannelScreen: undefined;

  Courses: undefined;
  Course: undefined;
  Friends: undefined;
  FriendProfile: undefined;
};

export type MessagesStackScreenProps<
  Screen extends keyof MessagesStackParamList
> = NativeStackScreenProps<MessagesStackParamList>;

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AuthStackScreenProps<Screen extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList>;

// Context

export type Context = {
  userName: string;
  userMajor: string;
  userGradYear: string;
  userInterests: string;
  userNumFriends: string;
  userInClass: boolean;
  userPrivate: boolean;
  setUserName: (arg0: string) => void;
  setUserMajor: (arg0: string) => void;
  setUserGradYear: (arg0: string) => void;
  setUserInterests: (arg0: string) => void;
  setUserPrivate: (arg0: boolean) => void;

  channel: undefined;
  setChannel: () => void;
};

// Stream Chat

type LocalAttachmentType = Record<string, unknown>;
type LocalChannelType = Record<string, unknown>;
type LocalCommandType = string;
type LocalEventType = Record<string, unknown>;
type LocalMessageType = Record<string, unknown>;
type LocalReactionType = Record<string, unknown>;
type LocalUserType = Record<string, unknown>;

export type StreamChatGenerics = {
  attachmentType: LocalAttachmentType;
  channelType: LocalChannelType;
  commandType: LocalCommandType;
  eventType: LocalEventType;
  messageType: LocalMessageType;
  reactionType: LocalReactionType;
  userType: LocalUserType;
};
