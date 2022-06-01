import { Text, View } from "../Themed";
import { StyleSheet, Pressable } from "react-native";

import { Enrollment } from "../../types";
import AppStyles from "../../styles/AppStyles";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import { getCourse } from "../../services/courses";
import useColorScheme from "../../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import AppContext from "../../context/Context";
import { useContext } from "react";
import ProfilePhoto from "../ProfilePhoto";
import { termIdToFullName } from "../../utils";

export default function MutualEnrollment({
  friend,
  time,
  enrollment,
}: {
  friend: {
    id: string;
    name: string;
    major?: string;
    gradYear?: string;
    photoUrl: string;
  };
  time: string;
  enrollment: Enrollment;
}) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  const handleOnPress = async () => {
    const course = await getCourse(enrollment.courseId);
    navigation.navigate("Course", { course });
  };

  return (
    <View
      style={[
        styles.notificationContainer,
        { borderBottomColor: Colors[colorScheme].tertiaryBackground },
      ]}
    >
      <Pressable onPress={handleOnPress} style={styles.innerContainer}>
        <ProfilePhoto
          url={friend.photoUrl}
          size={Layout.photo.xsmall}
          style={{ marginRight: Layout.spacing.small }}
        />
        <View style={styles.textContainer}>
          {enrollment.code.length > 0 && (
            <Text style={styles.notificationText} numberOfLines={3}>
              <Text
                style={{ fontWeight: "bold" }}
                onPress={() => {
                  navigation.navigate("FriendProfile", { id: friend.id });
                }}
              >
                {friend.name}{" "}
              </Text>
              <Text>just enrolled in </Text>
              <Text style={{ fontWeight: "bold" }}>
                {enrollment.code[0]}: {enrollment.title}{" "}
              </Text>
              <Text>for {termIdToFullName(enrollment.termId)}.</Text>
            </Text>
          )}
        </View>
        <Text
          style={[styles.time, { color: Colors[colorScheme].secondaryText }]}
        >
          {time}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  time: {
    fontSize: Layout.text.medium,
    paddingLeft: Layout.spacing.medium,
  },
  notificationText: {
    fontSize: Layout.text.medium,
    paddingLeft: Layout.spacing.xsmall,
  },
  notificationContainer: {
    padding: Layout.spacing.large,
    borderBottomWidth: 1,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
});
