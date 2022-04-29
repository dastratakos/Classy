import { Channel, Thread } from "stream-chat-expo";
import { useContext, useState } from "react";

import AppContext from "../context/Context";
import { StreamChat } from "stream-chat";
import { StyleSheet } from "react-native";
import { ThreadScreenProps } from "../types";

const STREAM_API_KEY = "y9tk9hsvsxqa";
const client = StreamChat.getInstance(STREAM_API_KEY);

export default function ThreadScreen({ route }: ThreadScreenProps) {
  const context = useContext(AppContext);

  const [channel] = useState(client.channel("messaging", route.params.id))

  return (
    <Channel channel={channel} thread={context.thread} threadList>
      <Thread thread={context.thread} />
    </Channel>
  );
}

const styles = StyleSheet.create({});
