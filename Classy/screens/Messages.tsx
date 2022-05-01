import { useContext } from "react";

import AppContext from "../context/Context";
import { ChannelList } from "stream-chat-expo";
import { Channel as ChannelType } from "stream-chat";
import { StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import { useNavigation } from "@react-navigation/core";
import ProfilePhoto from "../components/ProfilePhoto";
import Layout from "../constants/Layout";
import AppStyles from "../styles/AppStyles";

export default function Messages() {
  const context = useContext(AppContext);
  const navigation = useNavigation();

  const filters = { members: { $in: [context.user.id] } };
  const sort = { last_message_at: -1 };
  const options = { limit: 20, messages_limit: 30 };

  const CustomAvatar = ({ channel }: { channel: ChannelType }) => {
    let photoUrl = channel.data?.image;
    const filteredMembers = Object.values(channel.state.members).filter(
      (member) => member.user?.id !== context.user.id
    );
    // TODO: someone could name the group chat "Direct Message"
    if (channel.data?.name === "Direct Message") {
      if (filteredMembers.length === 1)
        photoUrl = filteredMembers[0].user.image;
    } else {
      if (filteredMembers.length === 1) {
        photoUrl = filteredMembers[0].user.image;
      } else if (filteredMembers.length > 1) {
        // TODO: it would be nice to get the last two active members, but right
        // now it is easier to just pick any two
        // console.log("last message:", channel.state.messages.slice(-1));

        /* Get two users and display both images. */
        const photo0 = filteredMembers[0].user.image;
        const photo1 = filteredMembers[1].user.image;

        return (
          <View style={AppStyles.row}>
            <ProfilePhoto url={photo0} size={Layout.photo.xsmall} />
            <ProfilePhoto url={photo1} size={Layout.photo.xsmall} />
          </View>
        )
      }
    }

    return <ProfilePhoto url={photoUrl} size={Layout.photo.xsmall} />;
  };

  const CustomTitle = ({ channel }: { channel: ChannelType }) => {
    let previewTitle = channel.data?.name;
    if (previewTitle === "Direct Message") {
      const filteredMembers = Object.values(channel.state.members).filter(
        (member) => member.user?.id !== context.user.id
      );
      if (filteredMembers.length === 1)
        previewTitle = filteredMembers[0].user.name;
    }

    return <Text style={{ fontWeight: "700" }}>{previewTitle}</Text>;
  };

  return (
    <ChannelList
      filters={filters}
      sort={sort}
      options={options}
      onSelect={(channel: ChannelType) => {
        context.setChannel(channel);
        context.setChannelName(channel.data.name);
        navigation.navigate("ChannelScreen");
      }}
      PreviewTitle={({ channel }) => <CustomTitle channel={channel} />}
      PreviewAvatar={({ channel }) => <CustomAvatar channel={channel} />}
    />
  );
}

const styles = StyleSheet.create({});
