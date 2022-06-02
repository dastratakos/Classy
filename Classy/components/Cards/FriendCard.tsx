import { SimpleLineIcons, Text, View } from "../Themed";
import { StyleSheet, Pressable, TouchableOpacity } from "react-native";
import Button from "../Buttons/Button";
import AppStyles from "../../styles/AppStyles";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import useColorScheme from "../../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import AppContext from "../../context/Context";
import { useContext } from "react";
import ProfilePhoto from "../ProfilePhoto";
import { Degree } from "../../types";

export default function FriendCard({
  friend,
  rightElement,
  onPress = () => {},
  friendStatus,
}: {
  friend: {
    id: string;
    name: string;
    degrees?: Degree[];
    gradYear?: string;
    photoUrl: string;
  };
  rightElement?: JSX.Element;
  onPress?: () => void;
  friendStatus?: string;
}) {
  const context = useContext(AppContext);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const degreeText = friend.degrees
    ? friend.degrees
        .map((d: Degree) => d.major + (d.degree ? ` (${d.degree})` : ""))
        .join(", ")
    : "";

  const addFriendPressed = () => {
    console.log("add friend");
    friendStatus = "request sent";
  };
  const requestedPressed = () => {
    console.log("requested");
    // maybe do an action sheet to cancel request?
  };
  const respondPressed = () => {
    console.log("respond");
  };
  // keeping "rightelement" because it's used for the "x" on channel details and search history
  // keep the x if its there, otherwise, reassign right element according to friend status
  if (friendStatus === "not friends") {
    rightElement = (
      <Button text={"Add Friend"} emphasized onPress={addFriendPressed} />
    );
  } else if (friendStatus === "request sent") {
    rightElement = <Button text={"Requested"} onPress={requestedPressed} />;
  } else if (friendStatus === "request received") {
    rightElement = (
      <View
        style={[
          styles.respondContainer,
          { backgroundColor: Colors[colorScheme].photoBackground },
        ]}
      >
        <TouchableOpacity
          onPress={respondPressed}
          style={styles.respondInnerContainer}
        >
          <Text style={{ paddingRight: Layout.spacing.xsmall }}>Respond</Text>
          <SimpleLineIcons name="arrow-down" />
        </TouchableOpacity>
      </View>
    );
  }
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
        {rightElement}
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
