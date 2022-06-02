import Colors from "../constants/Colors";
import { Text, View } from "../components/Themed";
import {
  Pressable,
  RefreshControl,
  SectionList,
  StyleSheet,
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
import { Notification, User } from "../types";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import { Timestamp } from "firebase/firestore";
import { getNotifications } from "../services/notifications";

export default function Notifications() {
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  const [notifications, setNotifications] = useState<
    { title: string; data: Notification[] }[]
  >([]);
  const [requests, setRequests] = useState<User[]>([]);

  const [refreshing, setRefreshing] = useState<boolean>(true);

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);

    const notifications = await getNotifications(context.user.id);

    const DAY_NANOSECONDS = 24 * 60 * 60 * 1000000000;

    let newArr = [];
    let earlierArr = [];
    for (let notification of notifications) {
      if (
        Timestamp.now().nanoseconds - notification.timestamp.nanoseconds <
        DAY_NANOSECONDS
      ) {
        newArr.push(notification);
      } else {
        earlierArr.push(notification);
      }
    }

    let notificationData = [];

    if (newArr.length > 0)
      notificationData.push({ title: "New", data: newArr });
    if (earlierArr.length > 0)
      notificationData.push({ title: "Earlier", data: earlierArr });

    setNotifications(notificationData);

    const requestIds = await getRequestIds(context.user.id);
    context.setRequestIds(requestIds);
    setRequests(await getFriendsFromIds(requestIds));

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
        sections={notifications}
        keyExtractor={(item, index) => item.type + index}
        renderItem={({ item }: { item: Notification }) => {
          switch (item.type) {
            case "FRIEND_REQUEST_RECEIVED":
              return <FriendRequestReceived notification={item} />;
            case "FRIEND_REQUEST_ACCEPTED":
              return <FriendRequestAccepted notification={item} />;
            case "MUTUAL_ENROLLMENT":
              return <MutualEnrollment notification={item} />;
            case "ADD_COURSES_REMINDER":
              return <AddCoursesReminder notification={item} />;
            case "ADD_TIMES_REMINDER":
              return <AddTimesReminder notification={item} />;
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
