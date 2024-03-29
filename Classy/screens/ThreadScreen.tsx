import { Channel, Thread } from "stream-chat-expo";
import { useContext, useState } from "react";

import AppContext from "../context/Context";
import { StyleSheet } from "react-native";
import { ThreadScreenProps } from "../types";

export default function ThreadScreen({ route }: ThreadScreenProps) {
  const context = useContext(AppContext);

  const [channel] = useState(
    context.streamClient.channel("messaging", route.params.id)
  );

  return (
    <Channel channel={channel} thread={context.thread} threadList>
      <Thread thread={context.thread} />
    </Channel>
  );
}

const styles = StyleSheet.create({});
