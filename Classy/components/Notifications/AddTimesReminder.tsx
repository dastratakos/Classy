import { Text, View } from "../Themed";
import { StyleSheet, Image, Pressable } from "react-native";

import AppStyles from "../../styles/AppStyles";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import useColorScheme from "../../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import AppContext from "../../context/Context";
import { useContext } from "react";
import ProfilePhoto from "../ProfilePhoto";
import { termIdToFullName } from "../../utils";

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
    <View
      style={[
        styles.notificationContainer,
        { borderBottomColor: Colors[colorScheme].tertiaryBackground },
      ]}
    >
      <Pressable
        onPress={() => {
          navigation.navigate("Enrollments", {
            userId: context.user.id,
            termId,
          });
        }}
        style={styles.innerContainer}
      >
        <Image
          source={require("../../assets/images/notifications/AddTimesReminder.png")}
          style={styles.image}
        />
        <View style={styles.textContainer}>
          <Text style={styles.notificationText} numberOfLines={3}>
            <Text>Reminder to input your </Text>
            <Text style={{ fontWeight: "bold" }}>class times </Text>
            <Text>for </Text>
            <Text style={{ fontWeight: "bold" }}>
              {termIdToFullName(termId)}
            </Text>
            <Text>!</Text>
          </Text>
        </View>
        <Text
          style={[styles.time, { color: Colors[colorScheme].secondaryText }]}
        >
          {time}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  time: {
    fontSize: Layout.text.medium,
    paddingLeft: Layout.spacing.medium,
  },
  notificationText: {
    fontSize: Layout.text.medium,
    paddingLeft: Layout.spacing.xsmall,
  },
  notificationContainer: {
    padding: Layout.spacing.large,
    borderBottomWidth: 1,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  image: {
    height: Layout.photo.xsmall,
    width: Layout.photo.xsmall,
    marginRight: Layout.spacing.small,
  },
});
