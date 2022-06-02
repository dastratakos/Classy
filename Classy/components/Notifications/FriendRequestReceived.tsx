import { Pressable, StyleSheet } from "react-native";
import { SimpleLineIcons, Text, View } from "../Themed";

import AppContext from "../../context/Context";
import AppStyles from "../../styles/AppStyles";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import ProfilePhoto from "../ProfilePhoto";
import notificationStyles from "./notificationStyles";
import useColorScheme from "../../hooks/useColorScheme";
import { useContext } from "react";
import { useNavigation } from "@react-navigation/core";

export default function FriendRequestReceived({
  friend,
  time,
}: {
  friend: {
    id: string;
    name: string;
    major?: string;
    gradYear?: string;
    photoUrl: string;
  };
  time: string;
}) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  // TODO implement accept/reject functionality
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
      <Text
        style={[
          notificationStyles.time,
          { color: Colors[colorScheme].secondaryText },
        ]}
      >
        {time}
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
    marginLeft: Layout.spacing.small,
    backgroundColor: "transparent",
  },
});
