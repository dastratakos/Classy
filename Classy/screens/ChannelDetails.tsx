import { Text, View } from "../components/Themed";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import { ScrollView, StyleSheet } from "react-native";
import { useContext, useEffect, useState } from "react";
import FriendCard from "../components/FriendCard";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import Layout from "../constants/Layout";

export default function ChannelDetails() {
  const context = useContext(AppContext);
  const colorScheme = useColorScheme();

  const [members, setMembers] = useState([]);

  useEffect(() => {
    const getState = async () => {
      const state = await context.channel.watch();
      console.log("members:", state.members);
      const filteredMembers = state.members.filter(
        (member) => member.user.id !== context.user.id
      );
      setMembers(filteredMembers);
    };

    getState();
  }, []);

  return (
    <ScrollView
      style={{ backgroundColor: Colors[colorScheme].background }}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={AppStyles.section}>
        {members.length > 1 && (
          <Text>TODO: change group photo</Text>
        )}
        <Text style={styles.title}>Members</Text>
        {members.map((member) => {
          return (
            <FriendCard
              friend={{ ...member.user, photoUrl: member.user.image }}
            />
          );
        })}
        {members.length > 1 && (
          <Text>TODO: Leave chat</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: Layout.text.large,
    fontWeight: "500",
    marginTop: Layout.spacing.small,
    marginBottom: Layout.spacing.medium,
  },
});
