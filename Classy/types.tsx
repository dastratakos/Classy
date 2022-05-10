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

export type FavoritedCourse = {
  code: string[];
  courseId: number;
  title: string;
  userId: string;
};

export type Enrollment = {
  docId: string;
  code: string[];
  courseId: number;
  grading: string; // Chosen grading basis
  schedules: Schedule[]; // Chosen schedules
  termId: string; // Chosen termId
  title: string;
  units: number; // Chosen number of units
  userId: string;
};

export type Term = {
  schedules: Schedule[];
  students: string[];
};

export type Schedule = {
  component: string;
  days: string[];
  endInfo: Timestamp;
  grading: string;
  instructors: Instructor[];
  location: string;
  sectionNumber: string;
  startInfo: Timestamp;
  termId: number;
};

export type Instructor = {
  firstName: string;
  lastName: string;
  middleName: string;
  name: string;
  role: string;
  sunet: string;
};

export type RootStackParamList = {
  AuthStack: NavigatorScreenParams<RootTabParamList> | undefined;
  HomeStack: NavigatorScreenParams<HomeStackParamList> | undefined;
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Settings: undefined;
  ManageAccount: undefined;
  NotFound: undefined;

  Login: { email?: string } | undefined;
  Register: { email?: string } | undefined;
  Onboarding: undefined;
  ResetPassword: undefined;

  Home: undefined;

  Messages: undefined;
  ChannelScreen: undefined;
  ThreadScreen: { id: string };
  ChannelDetails: undefined;
  NewMessage: undefined;

  Profile: undefined;
  Favorites: undefined;
  Courses: { termId: string };
  Course: { course: Course };
  AddCourse: { course: Course };
  MyQuarters: undefined;
  SelectQuarter: { terms: string[] };
  MyFriends: undefined;
  Friends: { id: string };
  FriendProfile: { id: string };
  CourseSimilarity: { id: string };
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList> | undefined;
  SearchStack: NavigatorScreenParams<SearchStackParamList> | undefined;
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
  Favorites: undefined;
  Courses: { termId: string };
  Course: { course: Course };
  AddCourse: { course: Course };
  MyQuarters: undefined;
  SelectQuarter: { terms: string[] };
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
  Favorites: undefined;
  Courses: { termId: string };
  Course: { course: Course };
  AddCourse: { course: Course };
  MyQuarters: undefined;
  SelectQuarter: { terms: string[] };
  MyFriends: undefined;
  Friends: { id: string };
  FriendProfile: { id: string };
  CourseSimilarity: { id: string };
};

export type SearchStackScreenProps<Screen extends keyof SearchStackParamList> =
  NativeStackScreenProps<SearchStackParamList>;

export type HomeStackParamList = {
  Home: undefined;

  Messages: undefined;
  ChannelScreen: undefined;
  ThreadScreen: { id: string };
  ChannelDetails: undefined;
  NewMessage: undefined;

  Courses: { termId: string };
  Course: { course: Course };
  AddCourse: { course: Course };
  MyFriends: undefined;
  Friends: { id: string };
  FriendProfile: { id: string };
  CourseSimilarity: { id: string };
};

export type HomeStackScreenProps<Screen extends keyof HomeStackParamList> =
  NativeStackScreenProps<HomeStackParamList>;

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  Onboarding: undefined;
};

export type AuthStackScreenProps<Screen extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList>;

export type LoginProps = NativeStackScreenProps<RootStackParamList, "Login">;
export type RegisterProps = NativeStackScreenProps<
  RootStackParamList,
  "Register"
>;

export type CourseProps = NativeStackScreenProps<RootStackParamList, "Course">;

export type AddCourseProps = NativeStackScreenProps<
  RootStackParamList,
  "AddCourse"
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

export type SelectQuarterProps = NativeStackScreenProps<
  RootStackParamList,
  "SelectQuarter"
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
  keywords: string[];
};

export type Context = {
  user: User;
  setUser: (arg0: User) => void;
  friendIds: string[];
  setFriendIds: (arg0: string[]) => void;
  streamClient: StreamChatGenerics;
  setStreamClient: (arg0: StreamChatGenerics) => void;
  channel: ChannelType;
  setChannel: (arg0: ChannelType) => void;
  channelName: string;
  setChannelName: (arg0: string) => void;
  thread: undefined;
  setThread: (arg0: MessageType) => void;
  selectedTerm: string;
  setSelectedTerm: (arg0: string) => void;
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
