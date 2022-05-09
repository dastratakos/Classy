import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { Text, View } from "../components/Themed";
import { useContext, useEffect, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import Colors from "../constants/Colors";
import FriendCard from "../components/FriendCard";
import Layout from "../constants/Layout";
import Separator from "../components/Separator";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function ChannelDetails() {
  const context = useContext(AppContext);
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const [members, setMembers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveDisabled, setSaveDisabled] = useState(true);

  useEffect(() => {
    const getState = async () => {
      const state = await context.channel.watch();
      setGroupName(state.channel.name);
      const filteredMembers = state.members.filter(
        (member) => member.user.id !== context.user.id
      );
      setMembers(filteredMembers);
    };

    getState();
  }, []);

  const handleSavePress = async () => {
    setSaveLoading(true);

    await context.channel.updatePartial({ set: { name: groupName } });

    setSaveLoading(false);
    setSaveDisabled(true);
  };

  return (
    <ScrollView
      style={{ backgroundColor: Colors[colorScheme].background }}
      contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}
    >
      <View style={[AppStyles.section, { alignItems: "center" }]}>
        {members.length > 1 ? (
          <>
            <Text>TODO: change group photo</Text>
            <Separator />
            <KeyboardAvoidingView
              style={styles.inputContainer}
              behavior="padding"
            >
              <View
                style={[AppStyles.row, { marginBottom: Layout.spacing.large }]}
              >
                <View style={styles.field}>
                  <Text>Group name</Text>
                </View>
                <TextInput
                  placeholder="Name"
                  value={groupName}
                  onChangeText={(text) => {
                    setGroupName(text);
                    setSaveDisabled(false);
                  }}
                  style={[styles.input, { color: Colors[colorScheme].text }]}
                  autoCapitalize="words"
                  textContentType="name"
                />
              </View>
              <View style={AppStyles.row}>
                <View style={{ width: "48%" }}>
                  <Button text="Cancel" onPress={() => navigation.goBack()} />
                </View>
                <View style={{ width: "48%" }}>
                  <Button
                    text="Save Changes"
                    onPress={handleSavePress}
                    loading={saveLoading}
                    disabled={saveDisabled}
                    emphasized
                  />
                </View>
              </View>
            </KeyboardAvoidingView>
            <Separator />
          </>
        ) : null}
        <Text style={styles.title}>Members</Text>
        {/* TODO: use FlatList */}
        {members.map((member) => {
          return (
            <FriendCard
              friend={{ ...member.user, photoUrl: member.user.image }}
              key={member.user.id}
            />
          );
        })}
        {members.length > 1 ? <Text>TODO: Leave chat</Text> : null}
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
  inputContainer: {
    width: "100%",
  },
  field: {
    width: "40%",
    paddingRight: Layout.spacing.large,
  },
  input: {
    paddingVertical: Layout.spacing.xsmall,
    width: "60%",
  },
});
