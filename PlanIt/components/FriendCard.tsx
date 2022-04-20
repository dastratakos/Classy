import { StyleSheet, TouchableOpacity } from "react-native";
import { Icon, Text, View } from "./Themed";

import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { useNavigation } from "@react-navigation/core";
import useColorScheme from "../hooks/useColorScheme";

export default function FriendCard({
  name,
  major,
  gradYear,
}: {
  name: string;
  major: string;
  gradYear: string;
}) {
  const navigation = useNavigation();

  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("FriendProfile")}
      style={[styles.container, { borderColor: Colors[colorScheme].border }]}
    >
      <View
        style={[
          styles.photo,
          { backgroundColor: Colors[colorScheme].imagePlaceholder },
        ]}
      ></View>
      <View style={styles.textContainer}>
        <Text style={styles.name}>{name}</Text>
        {/* Major */}
        <View style={styles.row}>
          <View style={styles.iconWrapper}>
            <Icon name="pencil" size={25} />
          </View>
          <Text>{major}</Text>
        </View>
        {/* Graduation Year */}
        <View style={styles.row}>
          <View style={styles.iconWrapper}>
            <Icon name="graduation-cap" size={25} />
          </View>
          <Text>{gradYear}</Text>
        </View>
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
  photo: {
    height: Layout.image.small,
    width: Layout.image.small,
    borderRadius: Layout.image.small / 2,
    marginRight: Layout.spacing.small,
  },
  textContainer: {
    justifyContent: "space-between",
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
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    width: 30,
    marginRight: 15,
    alignItems: "center",
  },
});
