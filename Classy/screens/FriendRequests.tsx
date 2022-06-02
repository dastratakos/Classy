import { View } from "../components/Themed";
import { FriendRequestsProps, User } from "../types";
import { ScrollView, StyleSheet } from "react-native";
import { useContext, useState } from "react";

import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import FriendList from "../components/Lists/FriendList";
import AppContext from "../context/Context";

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
        <FriendList friends={requests} emptyPrimary="No friend requests" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
