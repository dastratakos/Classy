import { Alert, Image, Pressable, StyleSheet } from "react-native";
import { Text, View } from "../Themed";
import { getTimeSinceString, termIdToFullName } from "../../utils";

import Colors from "../../constants/Colors";
import { Notification } from "../../types";
import notificationStyles from "./notificationStyles";
import useColorScheme from "../../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function AddCoursesReminder({
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
        navigation.navigate("SearchStack", {
          screen: "Search",
          params: { initialSelectedTab: 1 },
        });
      }}
      onLongPress={deleteNotificationAlert}
      style={[
        notificationStyles.container,
        { borderColor: Colors[colorScheme].tertiaryBackground },
      ]}
    >
      <Image
        source={require("../../assets/images/notifications/AddCoursesReminder.png")}
        style={notificationStyles.squareImage}
      />
      <View style={notificationStyles.textContainer}>
        <Text style={notificationStyles.notificationText} numberOfLines={3}>
          <Text>Add courses to </Text>
          <Text style={notificationStyles.pressableText}>
            {termIdToFullName(notification.termId)}
          </Text>
          <Text> by searching for course code or name.</Text>
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
