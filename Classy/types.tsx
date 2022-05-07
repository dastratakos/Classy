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
import { Timestamp } from "firebase/firestore";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type Course = {
  academicCareer: string;
  academicGroup: string[];
  academicOrganization: string[];
  code: string[];
  courseId: number;
  description: string;
  effectiveStatus: string;
  finalExamFlag: string;
  gers: string[];
  grading: string[];
  keywords: string[];
  latestYear: string;
  maxTimesRepeat: number;
  maxUnitsRepeat: number;
  remote: string;
  repeatable: string;
  title: string;
  unitsMax: number;
  unitsMin: number;
};

export type Term = {
  schedules: Schedule[];
  students: string[];
}

export type Schedule = {
  component: string;
  days: string[];
  endInfo: Timestamp;
  instructors: Instructor[];
  location: string;
  sectionNumber: string;
  startInfo: Timestamp;
  termId: number;
}

export type Instructor = {
  firstName: string;
  lastName: string;
  middleName: string;
  name: string;
  role: string;
  sunet: string;
}

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

  Profile: undefined;
  Courses: { termId: string };
  Course: { course: Course };
  AddEditCourse: { course: Course };
  MyQuarters: undefined;
  MyFriends: undefined;
  Friends: { id: string };
  FriendProfile: { id: string };
  CourseSimilarity: { id: string };
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
  Courses: { termId: string };
  Course: { course: Course };
  AddEditCourse: { course: Course };
  MyQuarters: undefined;
  MyFriends: undefined;
  Friends: { id: string };
  FriendProfile: { id: string };
  CourseSimilarity: { id: string };
};

export type ProfileStackScreenProps<
  Screen extends keyof ProfileStackParamList
> = NativeStackScreenProps<ProfileStackParamList>;

export type SearchStackParamList = {
  Search: undefined;
  Profile: undefined;
  Courses: { termId: string };
  Course: { course: Course };
  AddEditCourse: { course: Course };
  MyQuarters: undefined;
  MyFriends: undefined;
  Friends: { id: string };
  FriendProfile: { id: string };
  CourseSimilarity: { id: string };
};

export type SearchStackScreenProps<Screen extends keyof SearchStackParamList> =
  NativeStackScreenProps<SearchStackParamList>;

export type MessagesStackParamList = {
  Messages: undefined;
  ChannelScreen: undefined;
  ThreadScreen: { id: string };
  ChannelDetails: undefined;
  NewMessage: undefined;

  Courses: { termId: string };
  Course: { course: Course };
  AddEditCourse: { course: Course };
  MyFriends: undefined;
  Friends: { id: string };
  FriendProfile: { id: string };
  CourseSimilarity: { id: string };
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

export type AddEditCourseProps = NativeStackScreenProps<
  RootStackParamList,
  "AddEditCourse"
>;

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

export type CourseSimilarityProps = NativeStackScreenProps<
  RootStackParamList,
  "CourseSimilarity"
>;

export type CoursesProps = NativeStackScreenProps<
  RootStackParamList,
  "Courses"
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
  expoPushToken: string;
  terms: Object;
};

export type Context = {
  user: User;
  setUser: (arg0: User) => void;
  friendIds: string[];
  setFriendIds: (arg0: string[]) => void;
  channel: ChannelType;
  setChannel: (arg0: ChannelType) => void;
  channelName: string;
  setChannelName: (arg0: string) => void;
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
