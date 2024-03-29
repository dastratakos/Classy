import { Enrollment, Notification } from "../../types";
import { Alert, Image, Pressable, StyleSheet } from "react-native";
import { Text, View } from "../Themed";
import { getTimeSinceString, termIdToFullName } from "../../utils";

import AppContext from "../../context/Context";
import Colors from "../../constants/Colors";
import notificationStyles from "./notificationStyles";
import useColorScheme from "../../hooks/useColorScheme";
import { useContext } from "react";
import { useNavigation } from "@react-navigation/core";

export default function AddTimesReminder({
  notification,
  readNotification,
  deleteFunc = () => {},
}: {
  notification: Notification;
  readNotification: (arg0: string) => void;
  deleteFunc?: () => void;
}) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  const deleteNotificationAlert = () =>
    Alert.alert("Delete notification", "Are you sure?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: deleteFunc,
      },
    ]);

  return (
    <Pressable
      onPress={() => {
        readNotification(notification.docId);
        navigation.navigate("Enrollments", {
          userId: context.user.id,
          enrollments: context.enrollments.filter(
            (enrollment: Enrollment) =>
              enrollment.termId === notification.termId
          ),
          termId: notification.termId,
        });
      }}
      onLongPress={deleteNotificationAlert}
      style={[
        notificationStyles.container,
        { borderColor: Colors[colorScheme].tertiaryBackground },
      ]}
    >
      <Image
        source={require("../../assets/images/notifications/AddTimesReminder.png")}
        style={notificationStyles.squareImage}
      />
      <View style={notificationStyles.textContainer}>
        <Text style={notificationStyles.notificationText} numberOfLines={3}>
          <Text>Reminder to input your class times for </Text>
          <Text style={notificationStyles.pressableText}>
            {termIdToFullName(notification.termId)}
          </Text>
          <Text>!</Text>
        </Text>
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
