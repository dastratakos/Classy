import EmptyList from "../EmptyList";
import FriendCard from "../Cards/FriendCard";
import SVGNoFriends from "../../assets/images/undraw/noFriends.svg";
import SVGNoRequests from "../../assets/images/undraw/noRequests.svg";
import { User } from "../../types";
import { View } from "../Themed";
import { Pressable, StyleSheet } from "react-native";
import { SimpleLineIcons } from "../Themed";
import Layout from "../../constants/Layout";
import Colors from "../../constants/Colors";
import useColorScheme from "../../hooks/useColorScheme";

export default function FriendList({
  friends,
  emptyPrimary = "Nothing to see here",
  emptySecondary = "",
  showEmptyElement = true,
  requests = false,
}: {
  friends: User[];
  emptyPrimary?: string;
  emptySecondary?: string;
  showEmptyElement?: boolean;
  requests?: boolean;
}) {
  const colorScheme = useColorScheme();

  // TODO: use FlatList
  if (friends.length === 0 && showEmptyElement)
    return (
      <EmptyList
        SVGElement={requests ? SVGNoRequests : SVGNoFriends}
        primaryText={emptyPrimary}
        secondaryText={emptySecondary}
      />
    );
  return (
    <>
      {friends.map((friend) => (
        <View key={friend.id}>
          <FriendCard
            friend={friend}
            rightElement={
              requests ? (
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
              ) : (
                <></>
              )
            }
          />
        </View>
      ))}
    </>
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
