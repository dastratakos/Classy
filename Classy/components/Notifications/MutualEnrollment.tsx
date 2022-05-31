import { Text, View } from "../Themed";
import { StyleSheet, Pressable } from "react-native";

import { Enrollment } from "../../types";
import AppStyles from "../../styles/AppStyles";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import useColorScheme from "../../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import AppContext from "../../context/Context";
import { useContext } from "react";
import ProfilePhoto from "../ProfilePhoto";
import { termIdToFullName } from "../../utils";

export default function MutualEnrollment({
  friend,
  time,
  enrollment,
  onPress = () => {},
}: {
  friend: {
    id: string;
    name: string;
    major?: string;
    gradYear?: string;
    photoUrl: string;
  };
  time: string;
  enrollment: Enrollment;
  onPress?: () => void;
}) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  return (
    <View
      style={styles.notificationContainer}
    >
      <Pressable
        onPress={() => {
          onPress();
          console.log("Notification pressed");
        }}
        style={styles.innerContainer}
      >

        <ProfilePhoto
          url={friend.photoUrl}
          size={Layout.photo.xsmall}
          style={{ marginRight: Layout.spacing.small }}
        />

        <View style={styles.textContainer}>
        {enrollment.code.length > 0 &&
          <Text style={styles.notificationText} numberOfLines={3}>
            <Text style={{ fontWeight: "bold" }}>{friend.name} </Text>
            <Text>just enrolled in </Text>
            <Text style={{ fontWeight: "bold" }}>{enrollment.code[0]}</Text>
            <Text>: {enrollment.title} for </Text>
            <Text style={{ fontWeight: "bold" }}>{termIdToFullName(enrollment.termId)}.</Text>
          </Text>
        }
        </View>

        <Text style={styles.time}>{time}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  time: {
    color: "#808080",
    fontSize: 14,
    paddingLeft: Layout.spacing.medium
  },
  notificationText: {
    fontSize: 14,
    paddingLeft: Layout.spacing.xsmall,
  },
  notificationContainer: {
    padding: 20,
    borderBottomColor: "#c4c4c4",
    borderBottomWidth: 1
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
});
