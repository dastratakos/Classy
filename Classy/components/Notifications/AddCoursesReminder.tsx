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

export default function AddCoursesReminder({ time }: { time: string }) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  return (
    <View style={styles.notificationContainer}>
      <Pressable
        onPress={() => {
          navigation.navigate("SearchStack", {
            screen: "Search",
            params: { initialSelectedTab: 1 },
          });
        }}
        style={styles.innerContainer}
      >
        <Image
          source={require("../../assets/images/notifications/AddCoursesReminder.png")}
          style={styles.image}
        />

        <View style={styles.textContainer}>
          <Text style={styles.notificationText} numberOfLines={3}>
            <Text style={{ fontWeight: "bold" }}>Add courses </Text>
            <Text>
              to your current quarter by searching by course code or name.
            </Text>
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
    paddingLeft: Layout.spacing.medium,
  },
  notificationText: {
    fontSize: 14,
    paddingLeft: Layout.spacing.xsmall,
  },
  notificationContainer: {
    padding: 20,
    borderBottomColor: "#c4c4c4",
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
