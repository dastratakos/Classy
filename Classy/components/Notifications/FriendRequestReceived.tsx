import { SimpleLineIcons, Text, View } from "../Themed";
import { StyleSheet, Pressable } from "react-native";

import AppStyles from "../../styles/AppStyles";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import useColorScheme from "../../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import AppContext from "../../context/Context";
import { useContext } from "react";
import ProfilePhoto from "../ProfilePhoto";

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
    <View
      style={[
        styles.notificationContainer,
        { borderBottomColor: Colors[colorScheme].tertiaryBackground },
      ]}
    >
      <Pressable
        onPress={() => {
          navigation.navigate("FriendProfile", { id: friend.id });
        }}
        style={styles.innerContainer}
      >
        <ProfilePhoto
          url={friend.photoUrl}
          size={Layout.photo.xsmall}
          style={{ marginRight: Layout.spacing.small }}
        />
        <View style={styles.textContainer}>
          <Text style={styles.notificationText} numberOfLines={3}>
            <Text style={{ fontWeight: "bold" }}>{friend.name} </Text>
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
          style={[styles.time, { color: Colors[colorScheme].secondaryText }]}
        >
          {time}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  time: {
    fontSize: Layout.text.medium,
    paddingLeft: Layout.spacing.medium,
  },
  notificationText: {
    fontSize: Layout.text.medium,
    paddingLeft: Layout.spacing.xsmall,
  },
  notificationContainer: {
    padding: Layout.spacing.large,
    borderBottomWidth: 1,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
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
});
