import * as Haptics from "expo-haptics";

import { ScrollView, StyleSheet, RefreshControl, TouchableOpacity, SectionList, Pressable } from "react-native";
import { Text, View } from "../components/Themed";
import { useContext, useEffect, useState } from "react";

import AppContext from "../context/Context";
import Colors, { enrollmentColors } from "../constants/Colors";
import Layout from "../constants/Layout";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import AppStyles from "../styles/AppStyles";
import FriendRequestReceived from "../components/Notifications/FriendRequestReceived";
import FriendRequestAccepted from "../components/Notifications/FriendRequestAccepted";
import MutualEnrollment from "../components/Notifications/MutualEnrollment";
import AddCoursesReminder from "../components/Notifications/AddCoursesReminder";
import AddTimesReminder from "../components/Notifications/AddTimesReminder";

export default function Notifications() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  const [refreshing, setRefreshing] = useState<boolean>(true);
  
  // TODO delete and replace dummy data
  const DATA = [
    {
      title: "New",
      data: [
        {
          type: "FRIEND_REQUEST_RECEIVED",
          friend: {
            id: "vkk5ngcfnYgjCMDqXb65YZtpquM2",
            name: "Grace Alwan",
            photoUrl: "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/6K90G2P5LbT54j29CShLJC0IqdO2%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
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
            photoUrl: "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/6K90G2P5LbT54j29CShLJC0IqdO2%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
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
            photoUrl: "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/6K90G2P5LbT54j29CShLJC0IqdO2%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
          },
          time: "4h",
          enrollment: {
            code: ["CS 221"],
            courseId: "fakeCourseId",
            termId: 1226,
            title: "Artificial Intelligence: Principles and Techniques"
          },
          termId: "0",
        }
      ]
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
            photoUrl: "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/6K90G2P5LbT54j29CShLJC0IqdO2%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
          },
          time: "1w",
          enrollment: null,
          termId: "0",
        },
      ]
    },
  ];

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO retrieve notifications
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={{ backgroundColor: Colors[colorScheme].background }}
      contentContainerStyle={{ alignItems: "center" }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.section}>
        <SectionList
          sections={DATA} // TODO update to real data from not dummy data
          keyExtractor={(item, index) => item.type + item.time + index}
          renderItem={({ item }) => {
            if (item.type === "FRIEND_REQUEST_RECEIVED") {
              return (
                <FriendRequestReceived 
                  friend={item.friend}
                  time={item.time}
                />
              );
            } else if (item.type === "FRIEND_REQUEST_ACCEPTED") {
              return (
                <FriendRequestAccepted
                  friend={item.friend}
                  time={item.time}
                />
              );
            } else if (item.type === "MUTUAL_ENROLLMENT") {
              return (
                <MutualEnrollment
                  friend={item.friend}
                  time={item.time}
                  enrollment={item.enrollment}
                />
              );
            } else if (item.type === "ADD_COURSES_REMINDER") {
              return (
                <AddCoursesReminder
                  time={item.time}
                />
              );
            } else if (item.type === "ADD_TIMES_REMINDER") {
              return (
                <AddTimesReminder
                  time={item.time}
                  termId={item.termId}
                />
              );
            }
            return null;
          }}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeaderContainer}>
              <Text style={styles.sectionHeader}>{title}</Text>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    width: "100%",
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",    
    marginTop: 20,
    marginBottom: 5,
    paddingTop: Layout.spacing.medium,
    paddingLeft: Layout.spacing.medium,
  },
  sectionHeaderContainer: {
    borderBottomColor: "#c4c4c4",
    borderBottomWidth: 1,
  },
});
