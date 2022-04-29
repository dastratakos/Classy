import { Channel, MessageInput, MessageList } from "stream-chat-expo";
import { Text, View } from "../components/Themed";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import { StyleSheet } from "react-native";
import { useContext } from "react";
import { useNavigation } from "@react-navigation/core";

export default function ChannelDetails() {
  const context = useContext(AppContext);
  const navigation = useNavigation();

  return (
    <View style={AppStyles.section}>
      <Text>TODO: Channel Details screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
