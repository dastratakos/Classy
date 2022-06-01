import { Text, View } from "../Themed";
import { StyleSheet, Pressable } from "react-native";

import AppStyles from "../../styles/AppStyles";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import useColorScheme from "../../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import AppContext from "../../context/Context";
import { useContext } from "react";
import ProfilePhoto from "../ProfilePhoto";

export default function FriendRequestAccepted({
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
            <Text>accepted your friend request.</Text>
          </Text>
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
});
