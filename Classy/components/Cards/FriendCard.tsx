import * as Haptics from "expo-haptics";

import { Alert, Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { SimpleLineIcons, Text, View } from "../Themed";
import { useContext, useEffect, useRef, useState } from "react";

import ActionSheet from "react-native-actionsheet";
import AppContext from "../../context/Context";
import AppStyles from "../../styles/AppStyles";
import Button from "../Buttons/Button";
import Colors from "../../constants/Colors";
import { Degree, User } from "../../types";
import Layout from "../../constants/Layout";
import ProfilePhoto from "../ProfilePhoto";
import {
  acceptRequest,
  blockUser,
  blockUserWithDoc,
  deleteFriendship,
  getFriendStatus,
} from "../../services/friends";
import useColorScheme from "../../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import { sendPushNotification } from "../../utils";
import { addNotification } from "../../services/notifications";

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

  const [friendStatus, setFriendStatus] = useState<string>("not friends");
  const [friendDocId, setFriendDocId] = useState<string>("");

  const actionSheetRef = useRef();
  const requestSentActionSheetOptions = ["Delete Request", "Cancel"];
  const requestReceivedActionSheetOptions = [
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

  const handleAcceptRequest = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setFriendStatus("friends");
    acceptRequest(friendDocId);

    sendPushNotification(
      friend.expoPushToken,
      `${context.user.name} accepted your friend request`
    );

    addNotification(friend.id, "FRIEND_REQUEST_ACCEPTED", context.user.id);
  };

  const handleDeleteFriendship = async () => {
    setFriendStatus("not friends");
    deleteFriendship(friendDocId);
    setFriendDocId("");
  };

  const handleBlockUser = async () => {
    setFriendStatus("block sent");

    if (friendDocId) blockUserWithDoc(context.user.id, friend.id, friendDocId);
    else blockUser(context.user.id, friend.id);
  };

  const deleteRequestAlert = () =>
    Alert.alert(
      "Delete friend request",
      `You will have to request ${friend.name} again to be friends.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: handleDeleteFriendship,
        },
      ]
    );

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
    if (friendStatus === "request sent") {
      const action = requestSentActionSheetOptions[index];
      if (action === "Delete Request") deleteRequestAlert();
    } else if (friendStatus === "request received") {
      const action = requestReceivedActionSheetOptions[index];
      if (action === "Block") blockAlert();
      else if (action === "Accept Request") handleAcceptRequest();
      else if (action === "Delete Request") deleteRequestAlert();
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
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  actionSheetRef.current?.show();
                }}
              />
            ) : friendStatus === "request sent" ? (
              <Button
                text={"Requested"}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  actionSheetRef.current?.show();
                }}
              />
            ) : friendStatus === "request received" ? (
              <View
                style={[
                  styles.respondContainer,
                  { backgroundColor: Colors[colorScheme].photoBackground },
                ]}
              >
                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    actionSheetRef.current?.show();
                  }}
                  style={styles.respondInnerContainer}
                >
                  <Text style={{ paddingRight: Layout.spacing.xsmall }}>
                    Respond
                  </Text>
                  <SimpleLineIcons name="arrow-down" />
                </TouchableOpacity>
              </View>
            ) : null}
          </>
        )}
        {rightElement}
      </TouchableOpacity>
      <ActionSheet
        ref={actionSheetRef}
        options={
          friendStatus === "request receieved"
            ? requestReceivedActionSheetOptions
            : requestSentActionSheetOptions
        }
        cancelButtonIndex={
          friendStatus === "request receieved"
            ? requestReceivedActionSheetOptions.length - 1
            : requestSentActionSheetOptions.length - 1
        }
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
  acceptRejectContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: Layout.photo.small,
    width: Layout.photo.medium,
    borderRadius: Layout.radius.xsmall,
    marginLeft: Layout.spacing.small,
    backgroundColor: "transparent",
  },
  respondContainer: {
    ...AppStyles.boxShadow,
    height: Layout.buttonHeight.medium,
    borderRadius: Layout.radius.medium,
    alignItems: "center",
    justifyContent: "center",
  },
  respondInnerContainer: {
    height: Layout.buttonHeight.medium,
    borderRadius: Layout.radius.medium,
    padding: Layout.spacing.small,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
