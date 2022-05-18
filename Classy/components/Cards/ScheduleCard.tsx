import { StyleSheet, TouchableOpacity } from "react-native";
import { Icon, Text, View } from "../Themed";
import { componentToName, getTimeString } from "../../utils";

import AppStyles from "../../styles/AppStyles";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import { Schedule } from "../../types";
import useColorScheme from "../../hooks/useColorScheme";

export default function ScheduleCard({
  schedule,
  onPress,
  selected,
}: {
  schedule: Schedule;
  onPress: () => void;
  selected?: boolean;
}) {
  const colorScheme = useColorScheme();

  return (
    <View style={[styles.container, AppStyles.boxShadow]}>
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.innerContainer,
          { backgroundColor: Colors[colorScheme].cardBackground },
        ]}
      >
        <View style={[AppStyles.row, { backgroundColor: "transparent" }]}>
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {schedule.sectionNumber} {componentToName(schedule.component)}
            </Text>
            <Text style={styles.cardSubtitle} numberOfLines={1}>
              {schedule.days.join(", ")}{" "}
              {/* TODO: AFRICA IS BECAUSE OF TIMEZONE ERROR IN FIRESTORE DATABASE */}
              {getTimeString(schedule.startInfo, "Africa/Casablanca")} -{" "}
              {getTimeString(schedule.endInfo, "Africa/Casablanca")}
            </Text>
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
        </View>
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
  textContainer: {
    flex: 1,
    marginRight: Layout.spacing.small,
    backgroundColor: "transparent",
  },
});
