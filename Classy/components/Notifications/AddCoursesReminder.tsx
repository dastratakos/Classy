import { Image, Pressable, StyleSheet } from "react-native";
import { Text, View } from "../Themed";

import AppContext from "../../context/Context";
import Colors from "../../constants/Colors";
import notificationStyles from "./notificationStyles";
import useColorScheme from "../../hooks/useColorScheme";
import { useContext } from "react";
import { useNavigation } from "@react-navigation/core";

export default function AddCoursesReminder({ time }: { time: string }) {
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
          <Text>
            to your current quarter by searching by course code or name.
          </Text>
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
