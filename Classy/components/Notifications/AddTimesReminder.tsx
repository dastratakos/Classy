import { Image, Pressable, StyleSheet } from "react-native";
import { Text, View } from "../Themed";

import AppContext from "../../context/Context";
import Colors from "../../constants/Colors";
import notificationStyles from "./notificationStyles";
import { termIdToFullName } from "../../utils";
import useColorScheme from "../../hooks/useColorScheme";
import { useContext } from "react";
import { useNavigation } from "@react-navigation/core";

export default function AddCoursesReminder({
  time,
  termId,
}: {
  time: string;
  termId: string;
}) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  return (
    <Pressable
      onPress={() => {
        navigation.navigate("Enrollments", {
          userId: context.user.id,
          termId,
        });
      }}
      style={[
        notificationStyles.container,
        { borderColor: Colors[colorScheme].tertiaryBackground },
      ]}
    >
      <Image
        source={require("../../assets/images/notifications/AddTimesReminder.png")}
        style={notificationStyles.squareImage}
      />
      <View style={notificationStyles.textContainer}>
        <Text style={notificationStyles.notificationText} numberOfLines={3}>
          <Text>Reminder to input your </Text>
          <Text style={notificationStyles.pressableText}>class times </Text>
          <Text>for </Text>
          <Text style={notificationStyles.pressableText}>{termIdToFullName(termId)}</Text>
          <Text>!</Text>
        </Text>
      </View>
      <Text
        style={[
          notificationStyles.time,
          { color: Colors[colorScheme].secondaryText },
        ]}
      >
        {time}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({});
