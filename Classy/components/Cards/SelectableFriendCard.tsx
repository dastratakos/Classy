import { Icon, Text, View } from "../Themed";
import { StyleSheet, TouchableOpacity } from "react-native";

import AppContext from "../../context/Context";
import AppStyles from "../../styles/AppStyles";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import ProfilePhoto from "../ProfilePhoto";
import useColorScheme from "../../hooks/useColorScheme";
import { useContext } from "react";
import { useNavigation } from "@react-navigation/core";

export default function SelectableFriendCard({
  friend,
  onPress,
  selected,
}: {
  friend: {
    id: string;
    name: string;
    major?: string;
    gradYear?: string;
    photoUrl: string;
  };
  onPress?: () => void;
  selected?: boolean;
}) {
  const context = useContext(AppContext);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  return (
    <View
      style={[
        styles.container,
        AppStyles.boxShadow,
        { backgroundColor: Colors[colorScheme].cardBackground },
      ]}
    >
      <TouchableOpacity onPress={onPress} style={styles.innerContainer}>
        <ProfilePhoto
          url={friend.photoUrl}
          size={Layout.photo.small}
          style={{ marginRight: Layout.spacing.small }}
        />
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {friend.name}
          </Text>
          {friend.major || friend.gradYear ? (
            <Text style={styles.cardSubtitle} numberOfLines={1}>
              {friend.major}
              {friend.major && friend.gradYear ? " | " : null}
              {friend.gradYear}
            </Text>
          ) : null}
        </View>
        <Icon
          name={selected ? "check-circle" : "circle-o"}
          size={Layout.icon.medium}
          lightColor={
            selected
              ? Colors[colorScheme].tint
              : Colors[colorScheme].tertiaryBackground
          }
          darkColor={
            selected
              ? Colors[colorScheme].tint
              : Colors[colorScheme].tertiaryBackground
          }
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Layout.spacing.medium,
    paddingVertical: Layout.spacing.small,
    borderRadius: Layout.radius.medium,
    marginVertical: Layout.spacing.small,
    width: "100%",
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  cardTitle: {
    fontSize: Layout.text.xlarge,
    // fontWeight: "500",
  },
  cardSubtitle: {
    fontSize: Layout.text.medium,
  },
});
