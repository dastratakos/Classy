import { ChannelList } from "stream-chat-expo";
import { StyleSheet } from "react-native";

import { Channel as ChannelType } from "stream-chat";
import { useNavigation } from "@react-navigation/core";
import { useContext } from "react";
import AppContext from "../context/Context";

export default function Messages() {
  const context = useContext(AppContext);
  const navigation = useNavigation();

  const filters = { members: { $in: [context.user.id] } };
  const sort = { last_message_at: -1 };
  const options = { limit: 20, messages_limit: 30 };

  return (
    <ChannelList
      filters={filters}
      sort={sort}
      options={options}
      onSelect={(channel: ChannelType) => {
        context.setChannel(channel);
        navigation.navigate("ChannelScreen")
      }
      }
    />
  );
}

const styles = StyleSheet.create({});
