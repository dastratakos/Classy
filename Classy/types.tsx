/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Channel as ChannelType } from "stream-chat";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { MessageType } from "stream-chat-expo";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type Course = {
  year: string;
  subject: string;
  code: string;
  courseId: string;
  title: string;
  description: string;
  gers: string;
  repeatable: boolean;
  grading: string;
  unitsMin: number;
  unitsMax: number;
  remote: boolean;
  administrativeInformation: {
    courseId: number;
    effectiveStatus: string;
    offerNumber: string;
    academicGroup: string;
    academicOrganization: string;
    academicCareer: string;
    finalExamFlag: boolean;
    maxUnitsRepeat: number;
    maxTimesRepeat: number;
  };
};

export type RootStackParamList = {
  AuthStack: NavigatorScreenParams<RootTabParamList> | undefined;
  MessagesStack: NavigatorScreenParams<MessagesStackParamList> | undefined;
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Settings: undefined;
  ManageAccount: undefined;
  NotFound: undefined;

  Login: { email?: string } | undefined;
  Register: { email?: string } | undefined;
  ResetPassword: undefined;

  Messages: undefined;
  ChannelScreen: undefined;
  ThreadScreen: { id: string };
  ChannelDetails: undefined;
  NewMessage: undefined;

  Courses: undefined;
  Course: { id: string };
  Quarters: undefined;
  Friends: { id: string };
  FriendProfile: { id: string };
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  MessagesStack: NavigatorScreenParams<MessagesStackParamList> | undefined;
  SearchStack: NavigatorScreenParams<MessagesStackParamList> | undefined;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList> | undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type ProfileStackParamList = {
  Settings: undefined;
  ManageAccount: undefined;

  Profile: undefined;
  Courses: undefined;
  Course: { id: string };
  Quarters: undefined;
  Friends: { id: string };
  FriendProfile: { id: string };
};

export type ProfileStackScreenProps<
  Screen extends keyof ProfileStackParamList
> = NativeStackScreenProps<ProfileStackParamList>;

export type SearchStackParamList = {
  Search: undefined;
  Profile: undefined;
  Courses: undefined;
  Course: { id: string };
  Quarters: undefined;
  Friends: { id: string };
  FriendProfile: { id: string };
};

export type SearchStackScreenProps<Screen extends keyof SearchStackParamList> =
  NativeStackScreenProps<SearchStackParamList>;

export type MessagesStackParamList = {
  Messages: undefined;
  ChannelScreen: undefined;
  ThreadScreen: { id: string };
  ChannelDetails: undefined;
  NewMessage: undefined;

  Courses: undefined;
  Course: { id: string };
  Friends: { id: string };
  FriendProfile: { id: string };
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

export type LoginProps = NativeStackScreenProps<RootStackParamList, "Login">;
export type RegisterProps = NativeStackScreenProps<
  RootStackParamList,
  "Register"
>;

export type CourseProps = NativeStackScreenProps<RootStackParamList, "Course">;

export type ThreadScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ThreadScreen"
>;

export type FriendsProps = NativeStackScreenProps<
  RootStackParamList,
  "Friends"
>;

export type FriendProfileProps = NativeStackScreenProps<
  RootStackParamList,
  "FriendProfile"
>;

// Context

export type User = {
  id: string;
  email: string;
  name: string;
  major: string;
  gradYear: string;
  interests: string;
  isPrivate: boolean;
  photoUrl: string;
};

export type Context = {
  user: User;
  setUser: (arg0: User) => void;
  friendIds: string[];
  setFriendIds: (arg0: string[]) => void;
  channel: ChannelType;
  setChannel: (arg0: ChannelType) => void;
  thread: undefined;
  setThread: (arg0: MessageType) => void;
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
