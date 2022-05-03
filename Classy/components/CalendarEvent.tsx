import { Pressable, StyleSheet } from "react-native";
import { Text, View } from "./Themed";

import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";

export default function CalendarEvent({
  title,
  time,
  location,
  marginTop,
  height,
  leftIndent = 0,
  onPress,
}: {
  title: string;
  time: string;
  location: string;
  marginTop: number;
  height: number;
  leftIndent: number;
  onPress: () => void;
}) {
  return (
    <View style={[styles.container, { marginTop: marginTop }]}>
      <View style={[styles.leftPadding, { width: 45 + leftIndent }]} />
      <Pressable
        style={({ pressed }) => [
          styles.event,
          { opacity: pressed ? 0.5 : 0.75, height: height },
        ]}
        onPress={onPress}
      >
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.timeText}>{time}</Text>
        <Text style={styles.locationText}>{location}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...AppStyles.row,
    position: "absolute",
    backgroundColor: "transparent",
  },
  leftPadding: {
    backgroundColor: "transparent",
  },
  event: {
    paddingVertical: Layout.spacing.xxsmall,
    paddingHorizontal: Layout.spacing.small,
    flex: 1,
    borderRadius: Layout.radius.small,
    backgroundColor: Colors.lightRed,
    overflow: "hidden",
  },
  titleText: {
    fontWeight: "500",
  },
  timeText: {
    fontSize: Layout.text.small,
  },
  locationText: {
    fontSize: Layout.text.small,
    fontStyle: "italic",
  },
});
