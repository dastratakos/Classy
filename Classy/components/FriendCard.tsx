import { Icon, Text, View } from "./Themed";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function FriendCard({
  friend,
}: {
  friend: {
    id: string;
    name: string;
    major: string;
    gradYear: string;
    photoUrl: string;
  };
}) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("FriendProfile", { id: friend.id })}
      style={[styles.container, { borderColor: Colors[colorScheme].border }]}
    >
      {friend.photoUrl ? (
        <Image
          source={{ uri: friend.photoUrl }}
          style={[
            AppStyles.photoSmall,
            {
              marginRight: Layout.spacing.small,
              backgroundColor: Colors[colorScheme].imagePlaceholder,
            },
          ]}
        />
      ) : (
        <View
          style={[
            AppStyles.photoSmall,
            {
              marginRight: Layout.spacing.small,
              backgroundColor: Colors[colorScheme].imagePlaceholder,
            },
          ]}
        />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {friend.name}
        </Text>
        {/* Major */}
        {friend.major ? (
          <View style={AppStyles.row}>
            <View style={styles.iconWrapper}>
              <Icon name="pencil" size={25} />
            </View>
            <Text style={styles.aboutText} numberOfLines={1}>
              {friend.major}
            </Text>
          </View>
        ) : null}
        {/* Graduation Year */}
        {friend.gradYear ? (
          <View style={AppStyles.row}>
            <View style={styles.iconWrapper}>
              <Icon name="graduation-cap" size={25} />
            </View>
            <Text style={styles.aboutText} numberOfLines={1}>
              {friend.gradYear}
            </Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: Layout.spacing.medium,
    borderRadius: Layout.radius.medium,
    borderWidth: 1,
    marginVertical: Layout.spacing.small,
    width: "100%",
  },
  textContainer: {
    flex: 1,
  },
  aboutText: {
    flex: 1,
  },
  name: {
    fontSize: Layout.text.large,
    fontWeight: "500",
  },
  title: {
    fontSize: Layout.text.medium,
  },
  units: {
    // TODO: change font color
  },
  iconWrapper: {
    width: 30,
    marginRight: 15,
    alignItems: "center",
  },
});
