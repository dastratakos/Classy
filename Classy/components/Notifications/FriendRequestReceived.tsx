import * as Haptics from "expo-haptics";

import { Alert, Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { Notification, User } from "../../types";
import { SimpleLineIcons, Text, View } from "../Themed";
import {
  acceptRequest,
  blockUser,
  blockUserWithDoc,
  deleteFriendship,
  getFriendStatus,
} from "../../services/friends";
import { getTimeSinceString, sendPushNotification } from "../../utils";
import { useContext, useEffect, useRef, useState } from "react";

import ActionSheet from "react-native-actionsheet";
import AppContext from "../../context/Context";
import AppStyles from "../../styles/AppStyles";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import ProfilePhoto from "../ProfilePhoto";
import { addNotification } from "../../services/notifications";
import { getUser } from "../../services/users";
import notificationStyles from "./notificationStyles";
import useColorScheme from "../../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function FriendRequestReceived({
  notification,
  readNotification,
}: {
  notification: Notification;
  readNotification: (arg0: string) => void;
}) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  const [friend, setFriend] = useState<User>({} as User);
  const [friendDocId, setFriendDocId] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);

  const actionSheetRef = useRef();
  const actionSheetOptions = [
    "Block",
    "Accept Request",
    "Delete Request",
    "Cancel",
  ];

  useEffect(() => {
    const loadComponent = async () => {
      setFriend(await getUser(notification.friendId));

      const res = await getFriendStatus(context.user.id, friend.id);
      setFriendDocId(res.friendDocId);

      setLoading(false);
    };
    loadComponent();
  }, []);

  const handleAcceptRequest = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // setFriendStatus("friends");
    acceptRequest(friendDocId);

    sendPushNotification(
      friend.expoPushToken,
      `${context.user.name} accepted your friend request`
    );

    addNotification(friend.id, "FRIEND_REQUEST_ACCEPTED", context.user.id);
  };

  const handleDeleteFriendship = async () => {
    // setFriendStatus("not friends");
    deleteFriendship(friendDocId);
    setFriendDocId("");
  };

  const handleBlockUser = async () => {
    // setFriendStatus("block sent");

    if (friendDocId) blockUserWithDoc(context.user.id, friend.id, friendDocId);
    else blockUser(context.user.id, friend.id);
  };

  const cancelFriendRequestAlert = () =>
    Alert.alert("Cancel friend request", "Are you sure?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "OK",
        onPress: handleDeleteFriendship,
      },
    ]);

  const blockAlert = () =>
    Alert.alert(
      "Block user",
      `${friend.name} will no longer be able to see your profile, send you a friend request, or message you.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: handleBlockUser,
        },
      ]
    );

  const handleActionSheetOptionPressed = (index: number) => {
    const action = actionSheetOptions[index];
    if (action === "Block") blockAlert();
    else if (action === "Accept Request") handleAcceptRequest();
    else if (action === "Cancel Request") cancelFriendRequestAlert();
  };

  if (loading) return <View style={notificationStyles.container} />;

  return (
    <Pressable
      onPress={() => {
        readNotification(notification.docId);
        navigation.navigate("FriendProfile", { id: notification.friendId });
      }}
      style={[
        notificationStyles.container,
        { borderColor: Colors[colorScheme].tertiaryBackground },
      ]}
    >
      <ProfilePhoto url={friend.photoUrl} size={Layout.photo.xsmall} />
      <View style={notificationStyles.textContainer}>
        <Text style={notificationStyles.notificationText} numberOfLines={3}>
          <Text style={notificationStyles.pressableText}>{friend.name} </Text>
          <Text>sent you a friend request.</Text>
        </Text>
      </View>
      {notification.unread && <View style={notificationStyles.indicator} />}
      <TouchableOpacity
        style={[
          styles.respondContainer,
          { backgroundColor: Colors[colorScheme].photoBackground },
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          actionSheetRef.current?.show();
        }}
      >
        <Text style={{ paddingRight: Layout.spacing.xsmall }}>Respond</Text>
        <SimpleLineIcons name="arrow-down" />
      </TouchableOpacity>
      <Text
        style={[
          notificationStyles.time,
          { color: Colors[colorScheme].secondaryText },
        ]}
      >
        {getTimeSinceString(notification.timestamp)}
      </Text>
      <ActionSheet
        ref={actionSheetRef}
        options={actionSheetOptions}
        cancelButtonIndex={actionSheetOptions.length - 1}
        destructiveButtonIndex={0}
        onPress={handleActionSheetOptionPressed}
        title={friend.name}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  respondContainer: {
    ...AppStyles.boxShadow,
    height: Layout.buttonHeight.medium,
    borderRadius: Layout.radius.medium,
    marginLeft: Layout.spacing.xsmall,
    marginRight: Layout.spacing.small,
    padding: Layout.spacing.small,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
