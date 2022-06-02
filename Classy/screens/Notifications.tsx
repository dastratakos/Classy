import * as Haptics from "expo-haptics";

import Colors, { enrollmentColors } from "../constants/Colors";
import { FontAwesome, Ionicons, Text, View } from "../components/Themed";
import {
  Pressable,
  RefreshControl,
  SectionList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { getFriendsFromIds, getRequestIds } from "../services/friends";
import { useContext, useEffect, useState } from "react";

import AddCoursesReminder from "../components/Notifications/AddCoursesReminder";
import AddTimesReminder from "../components/Notifications/AddTimesReminder";
import AppContext from "../context/Context";
import FriendRequestAccepted from "../components/Notifications/FriendRequestAccepted";
import FriendRequestReceived from "../components/Notifications/FriendRequestReceived";
import FriendRequestsNotification from "../components/Notifications/FriendRequestsNotification";
import Layout from "../constants/Layout";
import MutualEnrollment from "../components/Notifications/MutualEnrollment";
import { NotificationData, User } from "../types";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import { Timestamp } from "firebase/firestore";

const DATA = [
  {
    title: "New",
    data: [
      {
        type: "FRIEND_REQUEST_RECEIVED",
        notification: {
          friendId: "vkk5ngcfnYgjCMDqXb65YZtpquM2",
          timestamp: Timestamp.now(),
        },
      },
      {
        type: "FRIEND_REQUEST_ACCEPTED",
        notification: {
          friendId: "vkk5ngcfnYgjCMDqXb65YZtpquM2",
          timestamp: Timestamp.now(),
        },
      },
      {
        type: "MUTUAL_ENROLLMENT",
        notification: {
          friendId: "vkk5ngcfnYgjCMDqXb65YZtpquM2",
          timestamp: Timestamp.now(),
          courseId: 105730,
          termId: "1226",
        },
      },
    ],
  },
  {
    title: "Earlier",
    data: [
      {
        type: "ADD_COURSES_REMINDER",
        notification: {
          timestamp: Timestamp.now(),
          termId: "1226"
        },
      },
      {
        type: "ADD_TIMES_REMINDER",
        notification: {
          timestamp: Timestamp.now(),
          termId: "1226",
        },
      },
      {
        type: "FRIEND_REQUEST_ACCEPTED",
        notification: {
          friendId: "vkk5ngcfnYgjCMDqXb65YZtpquM2",
          timestamp: Timestamp.now(),
        },
      },
    ],
  },
];

export default function Notifications() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  const [notifications, setNotifications] = useState<NotificationData>(DATA);
  const [requests, setRequests] = useState<User[]>([]);

  const [refreshing, setRefreshing] = useState<boolean>(true);

  useEffect(() => {
    const loadScreen = async () => {
      // TODO retrieve notifications

      setRequests(await getFriendsFromIds(context.requestIds));
    };
    loadScreen();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO retrieve notifications

    console.log("hi");

    const requestIds = await getRequestIds(context.user.id);
    context.setRequestIds(requestIds);
    setRequests(await getFriendsFromIds(requestIds));

    console.log("bye");

    setRefreshing(false);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].background },
      ]}
    >
      <SectionList
        sections={notifications} // TODO update to real data from not dummy data
        keyExtractor={(item, index) => item.type + index}
        renderItem={({ item }) => {
          switch (item.type) {
            case "FRIEND_REQUEST_RECEIVED":
              return <FriendRequestReceived notification={item.notification} />;
            case "FRIEND_REQUEST_ACCEPTED":
              return <FriendRequestAccepted notification={item.notification} />;
            case "MUTUAL_ENROLLMENT":
              return <MutualEnrollment notification={item.notification} />;
            case "ADD_COURSES_REMINDER":
              return <AddCoursesReminder notification={item.notification} />;
            case "ADD_TIMES_REMINDER":
              return <AddTimesReminder notification={item.notification} />;
            default:
              return null;
          }
        }}
        renderSectionHeader={({ section: { title } }) => (
          <View
            style={[
              styles.sectionHeaderContainer,
              { borderColor: Colors[colorScheme].tertiaryBackground },
            ]}
          >
            <Text style={styles.sectionHeader}>{title}</Text>
          </View>
        )}
        onRefresh={onRefresh}
        refreshing={refreshing}
        ListHeaderComponent={<FriendRequestsNotification requests={requests} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "500",
    marginTop: 20,
    marginBottom: 5,
    paddingLeft: Layout.spacing.medium,
  },
  sectionHeaderContainer: {
    borderBottomWidth: 1,
  },
});
