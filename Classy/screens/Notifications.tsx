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
import AppStyles from "../styles/AppStyles";
import FriendRequestAccepted from "../components/Notifications/FriendRequestAccepted";
import FriendRequestReceived from "../components/Notifications/FriendRequestReceived";
import FriendRequestsNotification from "../components/Notifications/FriendRequestsNotification";
import Layout from "../constants/Layout";
import MutualEnrollment from "../components/Notifications/MutualEnrollment";
import ProfilePhoto from "../components/ProfilePhoto";
import { User } from "../types";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

const DATA = [
  {
    title: "New",
    data: [
      {
        type: "FRIEND_REQUEST_RECEIVED",
        friend: {
          id: "vkk5ngcfnYgjCMDqXb65YZtpquM2",
          name: "Grace Alwan",
          photoUrl:
            "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/6K90G2P5LbT54j29CShLJC0IqdO2%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
        },
        time: "2h",
        enrollment: null,
        termId: "0",
      },
      {
        type: "FRIEND_REQUEST_ACCEPTED",
        friend: {
          id: "vkk5ngcfnYgjCMDqXb65YZtpquM2",
          name: "Tara Jones",
          photoUrl:
            "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/6K90G2P5LbT54j29CShLJC0IqdO2%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
        },
        time: "3h",
        enrollment: null,
        termId: "0",
      },
      {
        type: "MUTUAL_ENROLLMENT",
        friend: {
          id: "vkk5ngcfnYgjCMDqXb65YZtpquM2",
          name: "Jess Yeung",
          photoUrl:
            "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/6K90G2P5LbT54j29CShLJC0IqdO2%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
        },
        time: "4h",
        enrollment: {
          code: ["CS 221"],
          courseId: 105730,
          termId: 1226,
          title: "Artificial Intelligence: Principles and Techniques",
        },
        termId: "0",
      },
    ],
  },
  {
    title: "Earlier",
    data: [
      {
        type: "ADD_COURSES_REMINDER",
        friend: null,
        time: "1d",
        enrollment: null,
        termId: "0",
      },
      {
        type: "ADD_TIMES_REMINDER",
        friend: null,
        time: "3d",
        enrollment: null,
        termId: "1226",
      },
      {
        type: "FRIEND_REQUEST_ACCEPTED",
        friend: {
          id: "vkk5ngcfnYgjCMDqXb65YZtpquM2",
          name: "Dean Stratakos",
          photoUrl:
            "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/6K90G2P5LbT54j29CShLJC0IqdO2%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
        },
        time: "1w",
        enrollment: null,
        termId: "0",
      },
    ],
  },
];

export default function Notifications() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  const [notifications, setNotifications] = useState(DATA);
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
        sections={DATA} // TODO update to real data from not dummy data
        keyExtractor={(item, index) => item.type + item.time + index}
        renderItem={({ item }) => {
          switch (item.type) {
            case "FRIEND_REQUEST_RECEIVED":
              return (
                <FriendRequestReceived friend={item.friend} time={item.time} />
              );
            case "FRIEND_REQUEST_ACCEPTED":
              return (
                <FriendRequestAccepted friend={item.friend} time={item.time} />
              );
            case "MUTUAL_ENROLLMENT":
              return (
                <MutualEnrollment
                  friend={item.friend}
                  time={item.time}
                  enrollment={item.enrollment}
                />
              );
            case "ADD_COURSES_REMINDER":
              return <AddCoursesReminder time={item.time} />;
            case "ADD_TIMES_REMINDER":
              return <AddTimesReminder time={item.time} termId={item.termId} />;
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
