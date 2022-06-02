import { Image, Pressable, StyleSheet } from "react-native";
import { Text, View } from "../Themed";
import { getTimeSinceString, termIdToFullName } from "../../utils";

import { AddCoursesReminderNotification } from "../../types";
import AppContext from "../../context/Context";
import Colors from "../../constants/Colors";
import notificationStyles from "./notificationStyles";
import useColorScheme from "../../hooks/useColorScheme";
import { useContext } from "react";
import { useNavigation } from "@react-navigation/core";

export default function AddCoursesReminder({
  notification,
  indicator = false,
}: {
  notification: AddCoursesReminderNotification;
  indicator?: boolean;
}) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  return (
    <Pressable
      onPress={() => {
        navigation.navigate("SearchStack", {
          screen: "Search",
          params: { initialSelectedTab: 1 },
        });
      }}
      style={[
        notificationStyles.container,
        { borderColor: Colors[colorScheme].tertiaryBackground },
      ]}
    >
      <Image
        source={require("../../assets/images/notifications/AddCoursesReminder.png")}
        style={notificationStyles.squareImage}
      />
      <View style={notificationStyles.textContainer}>
        <Text style={notificationStyles.notificationText} numberOfLines={3}>
          <Text style={notificationStyles.pressableText}>Add courses </Text>
          <Text>to </Text>
          <Text style={notificationStyles.pressableText}>
            {termIdToFullName(notification.termId)}
          </Text>
          <Text> by searching by course code or name.</Text>
        </Text>
      </View>
      {indicator && <View style={notificationStyles.indicator} />}
      <Text
        style={[
          notificationStyles.time,
          { color: Colors[colorScheme].secondaryText },
        ]}
      >
        {getTimeSinceString(notification.timestamp)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({});
