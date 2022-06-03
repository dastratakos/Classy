import { Notification, User } from "../../types";
import { Alert, Pressable, StyleSheet } from "react-native";
import { Text, View } from "../Themed";
import { useEffect, useState } from "react";

import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import ProfilePhoto from "../ProfilePhoto";
import { getTimeSinceString } from "../../utils";
import { getUser } from "../../services/users";
import notificationStyles from "./notificationStyles";
import useColorScheme from "../../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function NewFriendship({
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

  const [friend, setFriend] = useState<User>({} as User);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadComponent = async () => {
      setFriend(await getUser(notification.friendId));
      setLoading(false);
    };
    loadComponent();
  }, []);

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

  if (loading) return <View style={notificationStyles.container} />;

  return (
    <Pressable
      onPress={() => {
        readNotification(notification.docId);
        navigation.navigate("FriendProfile", { id: friend.id });
      }}
      onLongPress={deleteNotificationAlert}
      style={[
        notificationStyles.container,
        { borderColor: Colors[colorScheme].tertiaryBackground },
      ]}
    >
      <ProfilePhoto url={friend.photoUrl} size={Layout.photo.xsmall} />
      <View style={notificationStyles.textContainer}>
        <Text style={notificationStyles.notificationText} numberOfLines={3}>
          <Text>You and</Text>
          <Text style={notificationStyles.pressableText}> {friend.name} </Text>
          <Text>became friends.</Text>
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
