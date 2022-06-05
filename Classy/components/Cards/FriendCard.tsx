import * as Haptics from "expo-haptics";

import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { Degree, User } from "../../types";
import { SimpleLineIcons, Text, View } from "../Themed";
import {
  acceptRequest,
  addFriend,
  blockUser,
  blockUserWithDoc,
  deleteFriendship,
  getFriendStatus,
} from "../../services/friends";
import {
  addNotification,
  deleteFriendshipNotifications,
} from "../../services/notifications";
import { useContext, useEffect, useRef, useState } from "react";

import ActionSheet from "react-native-actionsheet";
import AppContext from "../../context/Context";
import AppStyles from "../../styles/AppStyles";
import Button from "../Buttons/Button";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import ProfilePhoto from "../ProfilePhoto";
import { sendPushNotification } from "../../utils";
import useColorScheme from "../../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function FriendCard({
  friend,
  rightElement,
  onPress = () => {},
  showFriendStatus = false,
}: {
  friend: User;
  rightElement?: JSX.Element;
  onPress?: () => void;
  showFriendStatus?: boolean;
}) {
  const context = useContext(AppContext);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const [friendStatus, setFriendStatus] = useState<string>("friends");
  const [friendDocId, setFriendDocId] = useState<string>("");

  const actionSheetRef = useRef();
  const actionSheetOptions = [
    "Block",
    "Accept Request",
    "Delete Request",
    "Cancel",
  ];

  const degreeText = friend.degrees
    ? friend.degrees
        .map((d: Degree) => d.major + (d.degree ? ` (${d.degree})` : ""))
        .join(", ")
    : "";

  useEffect(() => {
    const loadComponent = async () => {
      const res = await getFriendStatus(context.user.id, friend.id);
      setFriendStatus(res.friendStatus);
      setFriendDocId(res.friendDocId);
    };
    if (showFriendStatus) loadComponent();
  }, []);

  const handleAddFriend = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setFriendStatus("request sent");
    setFriendDocId(await addFriend(context.user.id, friend.id));

    sendPushNotification(
      friend.expoPushToken,
      `${context.user.name} sent you a friend request`
    );

    addNotification(friend.id, "FRIEND_REQUEST_RECEIVED", context.user.id);
  };

  const handleAcceptRequest = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setFriendStatus("friends");
    acceptRequest(friendDocId);

    sendPushNotification(
      friend.expoPushToken,
      `${context.user.name} accepted your friend request`
    );

    addNotification(friend.id, "NEW_FRIENDSHIP", context.user.id);
  };

  const handleDeleteFriendship = async () => {
    setFriendStatus("not friends");
    deleteFriendship(friendDocId);
    deleteFriendshipNotifications(context.user.id, friend.id);
    setFriendDocId("");
  };

  const handleBlockUser = async () => {
    setFriendStatus("block sent");

    if (friendDocId) blockUserWithDoc(context.user.id, friend.id, friendDocId);
    else blockUser(context.user.id, friend.id);

    deleteFriendshipNotifications(context.user.id, friend.id);
  };

  const deleteFriendRequestAlert = () =>
    Alert.alert("Delete friend request", "Are you sure?", [
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
    if (friendStatus === "request received") {
      const action = actionSheetOptions[index];
      if (action === "Block") blockAlert();
      else if (action === "Accept Request") handleAcceptRequest();
      else if (action === "Delete Request") deleteFriendRequestAlert();
    }
  };

  return (
    <View
      style={[
        styles.container,
        AppStyles.boxShadow,
        { backgroundColor: Colors[colorScheme].cardBackground },
      ]}
    >
      <TouchableOpacity
        onPress={() => {
          onPress();
          if (friend.id === context.user.id) navigation.navigate("Profile");
          else navigation.navigate("FriendProfile", { id: friend.id });
        }}
        style={styles.innerContainer}
      >
        <ProfilePhoto
          url={friend.photoUrl}
          size={Layout.photo.xsmall}
          style={{ marginRight: Layout.spacing.small }}
        />
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {friend.name}
          </Text>
          {degreeText || friend.gradYear ? (
            <Text style={styles.cardSubtitle} numberOfLines={1}>
              {degreeText}
              {degreeText && friend.gradYear ? " | " : null}
              {friend.gradYear}
            </Text>
          ) : null}
        </View>
        {showFriendStatus && (
          <>
            {friendStatus === "not friends" ? (
              <Button
                text={"Add Friend"}
                emphasized
                onPress={handleAddFriend}
              />
            ) : friendStatus === "request sent" ? (
              <Button text={"Requested"} onPress={deleteFriendRequestAlert} />
            ) : friendStatus === "request received" ? (
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
                <Text style={{ paddingRight: Layout.spacing.xsmall }}>
                  Respond
                </Text>
                <SimpleLineIcons name="arrow-down" />
              </TouchableOpacity>
            ) : null}
          </>
        )}
        {rightElement}
      </TouchableOpacity>
      <ActionSheet
        ref={actionSheetRef}
        options={actionSheetOptions}
        cancelButtonIndex={actionSheetOptions.length - 1}
        destructiveButtonIndex={0}
        onPress={handleActionSheetOptionPressed}
        title={friend.name}
      />
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
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  cardTitle: {
    fontSize: Layout.text.xlarge,
    // fontWeight: "500",
  },
  cardSubtitle: {
    fontSize: Layout.text.medium,
  },
  respondContainer: {
    ...AppStyles.boxShadow,
    height: Layout.buttonHeight.medium,
    borderRadius: Layout.radius.medium,
    padding: Layout.spacing.small,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
