import { FriendRequestAcceptedNotification, User } from "../../types";
import { Pressable, StyleSheet } from "react-native";
import { Text, View } from "../Themed";
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

export default function FriendRequestAccepted({
  notification,
  indicator = false,
}: {
  notification: FriendRequestAcceptedNotification;
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

  return (
    <Pressable
      onPress={() => {
        navigation.navigate("FriendProfile", { id: friend.id });
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
          <Text>accepted your friend request.</Text>
        </Text>
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

const styles = StyleSheet.create({});
