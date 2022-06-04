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
import { MessageType } from "stream-chat-expo";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Timestamp } from "firebase/firestore";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type Degree = {
  degree: string;
  major: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  degrees: { degree: string; major: string }[];
  startYear: string;
  gradYear: string;
  interests: string;
  isPrivate: boolean;
  photoUrl: string;
  expoPushToken: string;
  terms: Object;
  keywords: string[];
  onboarded: boolean;
};

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
  numFriends: number;
};

/**
 * Lists of the last 10 searches for courses and people. Courses is a list of
 * courseIds and people is a list of userIds.
 */
export type HistoryIds = {
  courses: number[];
  people: string[];
};

export type History = {
  courses: Course[];
  people: User[];
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
  color: string;
  numFriends: number;
};

export type Term = {
  schedules: Schedule[];
  students: string[];
};

export type Schedule = {
  // classId: string;
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

export type Tab = {
  label: string;
  component: JSX.Element;
};

export type Event = {
  title: string;
  startInfo: Timestamp;
  endInfo: Timestamp;
  location: string;
  enrollment: Enrollment;
};

export type Day = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

export type DaySchedule = { day: Day; events: Event[] };

export type WeekSchedule = DaySchedule[];

export type CourseOverview = {
  enrollment: Enrollment;
  friends: User[];
  startInfo: Timestamp;
  endInfo: Timestamp;
  component: string;
};

export type HomeData = { today: CourseOverview[]; nextUp: CourseOverview[] };

export type NotificationType =
  | "FRIEND_REQUEST_RECEIVED"
  | "NEW_FRIENDSHIP"
  | "MUTUAL_ENROLLMENT"
  | "ADD_COURSES_REMINDER"
  | "ADD_TIMES_REMINDER";

export type Notification = {
  docId: string;
  userId: string;
  type: NotificationType;
  timestamp: Timestamp;
  friendId: string;
  courseId: number;
  termId: string;
  unread: boolean;
};

export type RootStackParamList = {
  AuthStack: NavigatorScreenParams<RootTabParamList> | undefined;
  HomeStack: NavigatorScreenParams<HomeStackParamList> | undefined;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList> | undefined;
  SearchStack: NavigatorScreenParams<SearchStackParamList> | undefined;
  NotificationStack:
    | NavigatorScreenParams<NotificationStackParamList>
    | undefined;
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Settings: undefined;
  AddDegree: undefined;
  EditDegree: undefined;
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

  Search: { initialSelectedTab?: number };

  Profile: undefined;
  Favorites: undefined;
  Enrollments: { userId: string; enrollments: Enrollment[]; termId: string };
  Course: { course: Course };
  AddCourse: { course: Course };
  EditCourse: { enrollment: Enrollment };
  Quarters: { user: User; enrollments: Enrollment[] };
  FullCalendar: { id: string };
  SelectColor: undefined;
  SelectQuarter: { terms: string[] };
  Friends: { id: string };
  FriendRequests: { requests: User[] };
  FriendProfile: { id: string };
  CourseSimilarity: {
    friendId: string;
    courseSimilarity: number;
    overlap: Enrollment[];
  };
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList> | undefined;
  SearchStack: NavigatorScreenParams<SearchStackParamList> | undefined;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList> | undefined;
  NotificationStack:
    | NavigatorScreenParams<NotificationStackParamList>
    | undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

export type ProfileStackParamList = {
  Settings: undefined;
  AddDegree: undefined;
  EditDegree: undefined;
  ManageAccount: undefined;

  Profile: undefined;
  Favorites: undefined;
  Enrollments: { userId: string; enrollments: Enrollment[]; termId: string };
  Course: { course: Course };
  AddCourse: { course: Course };
  EditCourse: { enrollment: Enrollment };
  Quarters: { user: User; enrollments: Enrollment[] };
  FullCalendar: { id: string };
  SelectColor: undefined;
  SelectQuarter: { terms: string[] };
  Friends: { id: string };
  FriendRequests: { requests: User[] };
  FriendProfile: { id: string };
  CourseSimilarity: { courseSimilarity: number; overlap: Enrollment[] };
};

export type ProfileStackScreenProps<
  Screen extends keyof ProfileStackParamList
> = NativeStackScreenProps<ProfileStackParamList>;

export type SearchStackParamList = {
  Search: { initialSelectedTab?: number };
  Profile: undefined;
  Favorites: undefined;
  Enrollments: { userId: string; enrollments: Enrollment[]; termId: string };
  Course: { course: Course };
  AddCourse: { course: Course };
  EditCourse: { enrollment: Enrollment };
  Quarters: { user: User; enrollments: Enrollment[] };
  FullCalendar: { id: string };
  SelectColor: undefined;
  SelectQuarter: { terms: string[] };
  Friends: { id: string };
  FriendRequests: { requests: User[] };
  FriendProfile: { id: string };
  CourseSimilarity: { courseSimilarity: number; overlap: Enrollment[] };
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

  Enrollments: { userId: string; enrollments: Enrollment[]; termId: string };
  Course: { course: Course };
  AddCourse: { course: Course };
  EditCourse: { enrollment: Enrollment };
  Friends: { id: string };
  FriendRequests: { requests: User[] };
  FriendProfile: { id: string };
  CourseSimilarity: { courseSimilarity: number; overlap: Enrollment[] };
};

export type HomeStackScreenProps<Screen extends keyof HomeStackParamList> =
  NativeStackScreenProps<HomeStackParamList>;

export type NotificationStackParamList = {
  Home: undefined;

  Messages: undefined;
  ChannelScreen: undefined;
  ThreadScreen: { id: string };
  ChannelDetails: undefined;
  NewMessage: undefined;

  Enrollments: { userId: string; enrollments: Enrollment[]; termId: string };
  Course: { course: Course };
  AddCourse: { course: Course };
  EditCourse: { enrollment: Enrollment };
  Friends: { id: string };
  FriendRequests: { requests: User[] };
  FriendProfile: { id: string };
  CourseSimilarity: { courseSimilarity: number; overlap: Enrollment[] };
};

export type NotificationStackScreenProps<
  Screen extends keyof NotificationStackParamList
> = NativeStackScreenProps<NotificationStackParamList>;

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  Onboarding: undefined;
};

export type AuthStackScreenProps<Screen extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList>;

export type SearchProps = NativeStackScreenProps<RootStackParamList, "Search">;

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

export type EditCourseProps = NativeStackScreenProps<
  RootStackParamList,
  "EditCourse"
>;

export type ThreadScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ThreadScreen"
>;

export type FullCalendarProps = NativeStackScreenProps<
  RootStackParamList,
  "FullCalendar"
>;

export type FriendsProps = NativeStackScreenProps<
  RootStackParamList,
  "Friends"
>;

export type FriendRequestsProps = NativeStackScreenProps<
  RootStackParamList,
  "FriendRequests"
>;

export type FriendProfileProps = NativeStackScreenProps<
  RootStackParamList,
  "FriendProfile"
>;

export type CourseSimilarityProps = NativeStackScreenProps<
  RootStackParamList,
  "CourseSimilarity"
>;

export type EnrollmentsProps = NativeStackScreenProps<
  RootStackParamList,
  "Enrollments"
>;

export type SelectQuarterProps = NativeStackScreenProps<
  RootStackParamList,
  "SelectQuarter"
>;

export type QuartersProps = NativeStackScreenProps<
  RootStackParamList,
  "Quarters"
>;

// Context

export type Context = {
  // Firestore
  user: User;
  setUser: (arg0: User) => void;
  friendIds: string[];
  setFriendIds: (arg0: string[]) => void;
  requestIds: string[];
  setRequestIds: (arg0: string[]) => void;
  enrollments: Enrollment[];
  setEnrollments: (arg0: Enrollment[]) => void;
  history: History;
  setHistory: (arg0: History) => void;
  favorites: FavoritedCourse[];
  setFavorites: (arg0: FavoritedCourse[]) => void;

  // StreamChat
  streamClient: StreamChatGenerics;
  setStreamClient: (arg0: StreamChatGenerics) => void;
  channel: ChannelType;
  setChannel: (arg0: ChannelType) => void;
  channelName: string;
  setChannelName: (arg0: string) => void;
  thread: undefined;
  setThread: (arg0: MessageType) => void;
  totalUnreadCount: number;
  setTotalUnreadCount: (arg0: number) => void;

  // Modal selections
  selectedTerm: string;
  setSelectedTerm: (arg0: string) => void;
  selectedColor: string;
  setSelectedColor: (arg0: string) => void;
  editDegreeIndex: number;
  setEditDegreeIndex: (arg0: number) => void;
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
