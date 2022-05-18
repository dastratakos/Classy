import { Icon2, Text, View } from "../Themed";
import { StyleSheet, Pressable, TouchableOpacity } from "react-native";

import AppStyles from "../../styles/AppStyles";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import useColorScheme from "../../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import AppContext from "../../context/Context";
import { useContext } from "react";
import ProfilePhoto from "../ProfilePhoto";

export default function FriendCard({
  friend,
  isRequest = false,
}: {
  friend: {
    id: string;
    name: string;
    major?: string;
    gradYear?: string;
    photoUrl: string;
  };
  isRequest?: boolean;
}) {
  const context = useContext(AppContext);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

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
          if (friend.id === context.user.id) navigation.navigate("Profile");
          else navigation.navigate("FriendProfile", { id: friend.id });
        }}
        style={styles.innerContainer}
      >
        <ProfilePhoto
          url={friend.photoUrl}
          size={Layout.photo.small}
          style={{ marginRight: Layout.spacing.small }}
        />
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {friend.name}
          </Text>
          {friend.major || friend.gradYear ? (
            <Text style={styles.cardSubtitle} numberOfLines={1}>
              {friend.major}
              {friend.major && friend.gradYear ? " | " : null}
              {friend.gradYear}
            </Text>
          ) : null}
        </View>
        {isRequest && (
          <View style={styles.acceptRejectContainer}>
            <Pressable onPress={() => console.log("Accept")}>
              <Icon2
                name="check"
                size={Layout.icon.large}
                lightColor={Colors[colorScheme].tint}
                darkColor={Colors[colorScheme].tint}
              />
            </Pressable>
            <Pressable onPress={() => console.log("Decline")}>
              <Icon2 name="close" size={Layout.icon.large} />
            </Pressable>
          </View>
        )}
      </TouchableOpacity>
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
});
