import { View } from "../components/Themed";
import { FriendRequestsProps, User } from "../types";
import { ScrollView, StyleSheet } from "react-native";
import { useContext, useState } from "react";

import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import AppContext from "../context/Context";
import EmptyList from "../components/EmptyList";
import FriendCard from "../components/Cards/FriendCard";
import SVGNoFriends from "../assets/images/undraw/noFriends.svg";
import SVGNoRequests from "../assets/images/undraw/noRequests.svg";

export default function FriendRequests({ route }: FriendRequestsProps) {
  const context = useContext(AppContext);
  const colorScheme = useColorScheme();

  const [requests, setRequests] = useState<User[]>(route.params.requests);

  return (
    <ScrollView
      style={{ backgroundColor: Colors[colorScheme].background }}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={AppStyles.section}>
        {requests.length === 0 ? (
          <EmptyList
            SVGElement={requests ? SVGNoRequests : SVGNoFriends}
            primaryText="No friend requests"
          />
        ) : (
          <>
            {requests.map((friend: User) => (
              <View key={friend.id}>
                <FriendCard friend={friend} showFriendStatus={true} />
              </View>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
