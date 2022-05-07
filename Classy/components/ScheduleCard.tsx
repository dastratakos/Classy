import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "./Themed";
import { componentToName, getTimeString } from "../utils";

import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { Schedule } from "../types";
import useColorScheme from "../hooks/useColorScheme";

export default function ScheduleCard({
  schedule,
  onPress,
  emphasized,
}: {
  schedule: Schedule;
  onPress: () => void;
  emphasized?: boolean;
}) {
  const colorScheme = useColorScheme();

  return (
    <View style={[styles.container, AppStyles.boxShadow]}>
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.innerContainer,
          {
            backgroundColor: emphasized
              ? Colors[colorScheme].tint
              : Colors[colorScheme].cardBackground,
          },
        ]}
      >
        <Text style={styles.cardTitle} numberOfLines={1}>
          {schedule.sectionNumber} {componentToName(schedule.component)}
        </Text>
        <Text style={styles.cardSubtitle} numberOfLines={1}>
          {schedule.days.join(", ")}{" "}
          {getTimeString(schedule.startInfo, "Africa/Casablanca")} -{" "}
          {getTimeString(schedule.endInfo, "Africa/Casablanca")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Layout.radius.medium,
    marginVertical: Layout.spacing.small,
    width: "100%",
  },
  innerContainer: {
    paddingHorizontal: Layout.spacing.medium,
    paddingVertical: Layout.spacing.small,
    borderRadius: Layout.radius.medium,
  },
  cardTitle: {
    fontSize: Layout.text.xlarge,
    // fontWeight: "500",
  },
  cardSubtitle: {
    fontSize: Layout.text.medium,
  },
});
