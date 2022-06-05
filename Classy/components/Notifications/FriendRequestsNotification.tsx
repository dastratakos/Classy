import { Pressable, StyleSheet } from "react-native";
import { Text, View } from "../Themed";

import AppStyles from "../../styles/AppStyles";
import Colors from "../../constants/Colors";
import { User } from "../../types";
import { Ionicons } from "../Themed";
import Layout from "../../constants/Layout";
import ProfilePhoto from "../ProfilePhoto";
import notificationStyles from "./notificationStyles";
import useColorScheme from "../../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import DoubleProfilePhoto from "../DoubleProfilePhoto";

export default function FriendRequestsNotification({
  requests,
  indicator = false, // TODO: add backend functionality to determine indicator
}: {
  requests: User[];
  indicator?: boolean;
}) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  if (requests.length === 0) return null;

  let namesText = requests[0].name;
  if (requests.length === 2) {
    namesText += ` and ${requests[1].name}`;
  } else if (requests.length > 2) {
    namesText += ` and ${requests.length - 1} others`;
  }

  return (
    <Pressable
      style={[
        notificationStyles.container,
        {
          borderTopWidth: 1,
          borderColor: Colors[colorScheme].tertiaryBackground,
        },
      ]}
      onPress={() => navigation.navigate("FriendRequests", { requests })}
    >
      <View style={[AppStyles.row, { flex: 1 }]}>
        {requests.length === 1 ? (
          <ProfilePhoto url={requests[0].photoUrl} size={Layout.photo.xsmall} />
        ) : (
          <DoubleProfilePhoto
            frontUrl={requests[0].photoUrl}
            backUrl={requests[1].photoUrl}
            size={Layout.photo.xsmall}
          />
        )}
        <View style={notificationStyles.textContainer}>
          <Text style={notificationStyles.pressableText}>Friend Requests</Text>
          <Text style={{ color: Colors[colorScheme].secondaryText }}>
            {namesText}
          </Text>
        </View>
      </View>
      {indicator && <View style={notificationStyles.indicator} />}
      <Ionicons name="chevron-forward" size={Layout.icon.medium} />
    </Pressable>
  );
}

const styles = StyleSheet.create({});
