import { Text, View } from "../Themed";
import { StyleSheet, Pressable } from "react-native";

import { Enrollment } from "../../types";
import AppStyles from "../../styles/AppStyles";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import { getCourse } from "../../services/courses";
import useColorScheme from "../../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import AppContext from "../../context/Context";
import { useContext } from "react";
import ProfilePhoto from "../ProfilePhoto";
import { termIdToFullName } from "../../utils";
import notificationStyles from "./notificationStyles";

export default function MutualEnrollment({
  friend,
  time,
  enrollment,
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
}) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  const handleOnPress = async () => {
    const course = await getCourse(enrollment.courseId);
    navigation.navigate("Course", { course });
  };

  return (
    <Pressable
      onPress={handleOnPress}
      style={[
        notificationStyles.container,
        { borderColor: Colors[colorScheme].tertiaryBackground },
      ]}
    >
      <ProfilePhoto url={friend.photoUrl} size={Layout.photo.xsmall} />
      <View style={notificationStyles.textContainer}>
        {enrollment.code.length > 0 && (
          <Text style={notificationStyles.notificationText} numberOfLines={3}>
            <Text
              style={notificationStyles.pressableText}
              onPress={() => {
                navigation.navigate("FriendProfile", { id: friend.id });
              }}
            >
              {friend.name}{" "}
            </Text>
            <Text>just enrolled in </Text>
            <Text style={notificationStyles.pressableText}>
              {enrollment.code[0]}: {enrollment.title}{" "}
            </Text>
            <Text>for {termIdToFullName(enrollment.termId)}.</Text>
          </Text>
        )}
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
