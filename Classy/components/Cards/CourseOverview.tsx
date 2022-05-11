import { Enrollment, User } from "../../types";
import { Pressable, StyleSheet } from "react-native";
import { Text, View } from "../Themed";
import { componentToName, getTimeString } from "../../utils";

import AppStyles from "../../styles/AppStyles";
import Colors from "../../constants/Colors";
import CourseOverviewModal from "../CourseOverviewModal";
import Layout from "../../constants/Layout";
import ProfilePhoto from "../ProfilePhoto";
import { Timestamp } from "firebase/firestore";
import useColorScheme from "../../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import { useState } from "react";

export default function CourseOverview({
  key,
  enrollment,
  friends,
  startInfo,
  endInfo,
  component,
}: {
  key: string;
  enrollment: Enrollment;
  friends: User[];
  startInfo: Timestamp;
  endInfo: Timestamp;
  component: string;
}) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View key={key}>
      <CourseOverviewModal
        enrollment={enrollment}
        friends={friends}
        startInfo={startInfo}
        endInfo={endInfo}
        component={component}
        visible={modalVisible}
        setVisible={setModalVisible}
      />
      <View
        style={[
          styles.container,
          { backgroundColor: Colors[colorScheme].secondaryBackground },
        ]}
      >
        <Text style={styles.code}>
          {enrollment.code.join(", ")} {component && componentToName(component)}
        </Text>
        <Text style={{ marginTop: Layout.spacing.xxsmall }}>
          {/* TODO: AFRICA IS BECAUSE OF TIMEZONE ERROR IN FIRESTORE DATABASE */}
          {getTimeString(startInfo, "Africa/Casablanca")} -{" "}
          {getTimeString(endInfo, "Africa/Casablanca")}
        </Text>
        <Text
          style={{
            fontWeight: "bold",
            marginTop: Layout.spacing.small,
            alignSelf: "center",
          }}
        >
          Class Friends ({friends.length})
        </Text>
        <View
          style={{ backgroundColor: Colors[colorScheme].secondaryBackground }}
        >
          {friends.length > 0 &&
            friends.slice(0, 3).map((item) => (
              <View
                key={item.id}
                style={[
                  styles.friendContainer,
                  AppStyles.boxShadow,
                  { backgroundColor: Colors[colorScheme].background },
                ]}
              >
                <Pressable
                  key={item.id}
                  style={[AppStyles.row, { backgroundColor: "transparent" }]}
                  onPress={() =>
                    navigation.navigate("FriendProfile", { id: item.id })
                  }
                >
                  <ProfilePhoto
                    url={item.photoUrl}
                    size={Layout.photo.xsmall}
                  />
                  <View
                    style={{
                      backgroundColor: "transparent",
                      flexGrow: 1,
                    }}
                  >
                    <Text style={{ fontSize: Layout.text.large }}>
                      {" "}
                      {item.name}
                    </Text>
                  </View>
                </Pressable>
              </View>
            ))}
          {friends.length === 0 && (
            <Text
              style={{ alignSelf: "center", marginTop: Layout.spacing.small }}
            >
              No friends in this class yet!
            </Text>
          )}
        </View>
        {friends.length > 3 && (
          <Pressable onPress={() => setModalVisible(true)}>
            <Text
              style={{
                fontSize: Layout.text.small,
                alignSelf: "center",
                color: Colors[colorScheme].tint,
              }}
            >
              Show More
            </Text>
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
    borderRadius: Layout.radius.large,
    marginVertical: Layout.spacing.small,
    width: "100%",
  },
  friendContainer: {
    paddingHorizontal: Layout.spacing.xsmall,
    paddingVertical: Layout.spacing.xsmall,
    borderRadius: Layout.radius.medium,
    marginVertical: Layout.spacing.small,
    width: "100%",
  },
  code: {
    fontSize: Layout.text.xlarge,
  },
  schedText: {
    fontSize: Layout.text.medium,
    fontWeight: "500",
  },
});
