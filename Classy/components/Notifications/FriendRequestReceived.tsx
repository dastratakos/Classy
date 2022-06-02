import { FriendRequestReceivedNotification, User } from "../../types";
import { Pressable, StyleSheet } from "react-native";
import { SimpleLineIcons, Text, View } from "../Themed";
import { useContext, useEffect, useState } from "react";

import AppContext from "../../context/Context";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import ProfilePhoto from "../ProfilePhoto";
import { getTimeSinceString } from "../../utils";
import { getUser } from "../../services/users";
import notificationStyles from "./notificationStyles";
import useColorScheme from "../../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function FriendRequestReceived({
  notification,
  indicator = false,
}: {
  notification: FriendRequestReceivedNotification;
  indicator?: boolean;
}) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  const [friend, setFriend] = useState<User>({} as User);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadComponent = async () => {
      setFriend(await getUser(notification.friendId));
      setLoading(false);
    };
    loadComponent();
  }, []);

  if (loading) return <View style={notificationStyles.container} />;

  // TODO implement accept/reject functionality
  return (
    <Pressable
      onPress={() => {
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
      <View style={styles.acceptRejectContainer}>
        <Pressable onPress={() => console.log("Accept")}>
          <SimpleLineIcons
            name="check"
            size={Layout.icon.large}
            lightColor={Colors[colorScheme].tint}
            darkColor={Colors[colorScheme].tint}
          />
        </Pressable>
        <Pressable onPress={() => console.log("Decline")}>
          <SimpleLineIcons name="close" size={Layout.icon.large} />
        </Pressable>
      </View>
      {indicator && <View style={notificationStyles.indicator} />}
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

const styles = StyleSheet.create({
  acceptRejectContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: Layout.photo.small,
    width: Layout.photo.medium,
    borderRadius: Layout.radius.xsmall,
    marginRight: Layout.spacing.small,
    backgroundColor: "transparent",
  },
});
