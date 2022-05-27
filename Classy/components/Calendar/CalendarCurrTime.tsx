import { StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";

import AppStyles from "../../styles/AppStyles";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import { Text } from "./../Themed";
import { Timestamp } from "firebase/firestore";
import gridStyles from "./gridStyles";
import { getMarginTop } from "./utils";

export default function CalendarCurrTime({
  startCalendarHour,
  timesWidth,
}: {
  startCalendarHour: number;
  timesWidth: number;
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

  return (
    <View
      style={[
        AppStyles.row,
        {
          position: "absolute",
          // subtract 6 for height of text
          marginTop: getMarginTop(currTime, startCalendarHour) - 6,
        },
      ]}
    >
      <Text
        style={[
          gridStyles.gridTimeText,
          { color: Colors.pink, width: timesWidth - 5, paddingRight: 5 },
        ]}
      >
        {getCurrTimeString(currTime)}
      </Text>
      <View style={[gridStyles.gridLine, { backgroundColor: Colors.pink }]} />
      <View style={styles.currTimeDot} />
    </View>
  );
}

const styles = StyleSheet.create({
  currTimeDot: {
    position: "absolute",
    left: 45 - Layout.spacing.xsmall / 2,
    height: Layout.spacing.xsmall,
    width: Layout.spacing.xsmall,
    borderRadius: Layout.spacing.xsmall / 2,
    backgroundColor: Colors.pink,
  },
});
