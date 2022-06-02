import { Course, Notification, User } from "../../types";
import { Pressable, StyleSheet } from "react-native";
import { Text, View } from "../Themed";
import { getTimeSinceString, termIdToFullName } from "../../utils";
import { useContext, useEffect, useState } from "react";

import AppContext from "../../context/Context";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import ProfilePhoto from "../ProfilePhoto";
import { getCourse } from "../../services/courses";
import { getUser } from "../../services/users";
import notificationStyles from "./notificationStyles";
import useColorScheme from "../../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function MutualEnrollment({
  notification,
}: {
  notification: Notification;
}) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  const [friend, setFriend] = useState<User>({} as User);
  const [course, setCourse] = useState<Course>({} as Course);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadComponent = async () => {
      setFriend(await getUser(notification.friendId));
      setCourse(await getCourse(notification.courseId));
      setLoading(false);
    };
    loadComponent();
  }, []);

  if (loading) return <View style={notificationStyles.container} />;

  const handleOnPress = async () => {
    navigation.navigate("Course", { course });
  };

  return (
    <Pressable
      onPress={handleOnPress}
      style={[
        notificationStyles.container,
        { borderColor: Colors[colorScheme].tertiaryBackground },
      ]}
    >
      <ProfilePhoto url={friend.photoUrl} size={Layout.photo.xsmall} />
      <View style={notificationStyles.textContainer}>
        {course.code.length > 0 && (
          <Text style={notificationStyles.notificationText} numberOfLines={3}>
            <Text
              style={notificationStyles.pressableText}
              onPress={() => {
                navigation.navigate("FriendProfile", { id: friend.id });
              }}
            >
              {friend.name}{" "}
            </Text>
            <Text>just enrolled in </Text>
            <Text style={notificationStyles.pressableText}>
              {course.code[0]}: {course.title}{" "}
            </Text>
            <Text>for {termIdToFullName(notification.termId)}.</Text>
          </Text>
        )}
      </View>
      {notification.unread && <View style={notificationStyles.indicator} />}
      <Text
        style={[
          notificationStyles.time,
          { color: Colors[colorScheme].secondaryText },
        ]}
      >
        {getTimeSinceString(notification.timestamp)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({});
