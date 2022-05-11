import { Pressable, StyleSheet } from "react-native";
import { Text, View } from "../Themed";

import Layout from "../../constants/Layout";
import { useNavigation } from "@react-navigation/core";
import useColorScheme from "../../hooks/useColorScheme";
import { Enrollment, Schedule, User } from "../../types";
import AppStyles from "../../styles/AppStyles";
import { useState } from "react";

import CourseOverviewModal from "../CourseOverviewModal";
import ProfilePhoto from "../ProfilePhoto";
import Colors from "../../constants/Colors";
import { getTimeString } from "../../utils";

export default function CourseOverview({
  key,
  enrollment,
  friends,
}: {
  key: string;
  enrollment: Enrollment;
  friends: User[];
}) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View key={key}>
      <CourseOverviewModal
        enrollment={enrollment}
        friends={friends}
        visible={modalVisible}
        setVisible={setModalVisible}
      />
      <View
        style={[
          AppStyles.boxShadow,
          styles.container,
          { backgroundColor: Colors[colorScheme].cardBackground },
        ]}
      >
        <Text style={styles.title}>{enrollment.code.join(", ")}</Text>
        {enrollment.schedules.map((schedule: Schedule, i) => (
          <Text style={styles.schedText}>
            {schedule.days.join(", ")}{" "}
            {/* TODO: AFRICA IS BECAUSE OF TIMEZONE ERROR IN FIRESTORE DATABASE */}
            {getTimeString(schedule.startInfo, "Africa/Casablanca")} -{" "}
            {getTimeString(schedule.endInfo, "Africa/Casablanca")}
          </Text>
        ))}
        <Text>Class Friends</Text>
        <View>
          {friends.slice(0, 3).map((item) => (
            <Pressable
              key={item.id}
              style={[
                AppStyles.row,
                { backgroundColor: Colors[colorScheme].cardBackground },
              ]}
              onPress={() =>
                navigation.navigate("FriendProfile", { id: item.id })
              }
            >
              <ProfilePhoto url={item.photoUrl} size={Layout.photo.xsmall} />
              <View
                style={{
                  backgroundColor: Colors[colorScheme].cardBackground,
                  flexGrow: 1,
                }}
              >
                <Text> {item.name}</Text>
              </View>
            </Pressable>
          ))}
        </View>
        {friends.length > 3 && (
          <Pressable onPress={() => setModalVisible(true)}>
            <Text>Show More</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Layout.spacing.medium,
    paddingVertical: Layout.spacing.small,
    borderRadius: Layout.radius.medium,
    marginVertical: Layout.spacing.small,
    width: "100%",
  },
  title: {
    fontSize: Layout.text.xlarge,
    marginBottom: Layout.spacing.medium,
  },
  schedText: {
    fontSize: Layout.text.medium,
    fontWeight: "500",
  },
});
