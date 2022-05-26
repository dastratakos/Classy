import { StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";

import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { Text } from "./Themed";
import { Timestamp } from "firebase/firestore";

export default function CalendarCurrTime({
  startCalendarHour,
}: {
  startCalendarHour: number;
}) {
  const [currTime, setCurrTime] = useState<Timestamp>(Timestamp.now());

  useEffect(() => {
    const interval = setInterval(() => setCurrTime(Timestamp.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getCurrTimeString = (currTime: Timestamp) => {
    const now = currTime.toDate();
    const minutes = `${now.getMinutes()}`.padStart(2, "0");
    return `${((now.getHours() - 1) % 12) + 1}:${minutes}`;
  };

  const getMarginTop = (time: Timestamp, timeAdjustment: number = 0) => {
    const offset = Layout.spacing.medium + Layout.spacing.xxxlarge / 2;
    const t = time.toDate();
    const hourDiff = t.getHours() - startCalendarHour + timeAdjustment;

    return (
      offset +
      hourDiff * Layout.spacing.xxxlarge +
      (t.getMinutes() * Layout.spacing.xxxlarge) / 60
    );
  };

  return (
    <View
      style={[
        AppStyles.row,
        {
          position: "absolute",
          // subtract 6 for height of text
          marginTop: getMarginTop(currTime) - 6,
        },
      ]}
    >
      <Text style={[styles.gridTimeText, { color: Colors.pink }]}>
        {getCurrTimeString(currTime)}
      </Text>
      <View style={[styles.gridLine, { backgroundColor: Colors.pink }]} />
      <View style={styles.currTimeDot} />
    </View>
  );
}

const styles = StyleSheet.create({
  gridTimeText: {
    fontWeight: "600",
    width: 45,
    textAlign: "right",
    paddingRight: 10,
    fontSize: Layout.text.small,
    backgroundColor: "transparent",
  },
  gridLine: {
    flex: 1,
    height: 1,
    borderRadius: 1,
  },
  currTimeDot: {
    position: "absolute",
    left: 45 - Layout.spacing.xsmall / 2,
    height: Layout.spacing.xsmall,
    width: Layout.spacing.xsmall,
    borderRadius: Layout.spacing.xsmall / 2,
    backgroundColor: Colors.pink,
  },
});
