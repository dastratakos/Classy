import { Text, View } from "../Themed";
import { StyleSheet, Pressable } from "react-native";

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
  onPress = () => {},
}: {
  time: string;
  termId: string;
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
        {/* TODO change photo */}
        <ProfilePhoto
          url={"https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/6K90G2P5LbT54j29CShLJC0IqdO2%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8"}
          size={Layout.photo.xsmall}
          style={{ marginRight: Layout.spacing.small }}
        />

        <View style={styles.textContainer}>
          <Text style={styles.notificationText} numberOfLines={3}>
            <Text>Reminder to input your </Text> 
            <Text style={{ fontWeight: "bold" }}>class times </Text>
            <Text>for </Text>
            <Text style={{ fontWeight: "bold" }}>{termIdToFullName(termId)}</Text>
            <Text>!</Text> 
          </Text>
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
