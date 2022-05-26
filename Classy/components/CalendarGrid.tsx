import { StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";

import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { Text } from "./Themed";
import { Timestamp } from "firebase/firestore";
import useColorScheme from "../hooks/useColorScheme";

export default function CalendarGrid({
  times,
  index,
  today,
}: {
  times: number[];
  index: number;
  today: number;
}) {
  const colorScheme = useColorScheme();

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
    const hourDiff = t.getHours() - times[0] + timeAdjustment;

    return (
      offset +
      hourDiff * Layout.spacing.xxxlarge +
      (t.getMinutes() * Layout.spacing.xxxlarge) / 60
    );
  };

  /**
   * The current time is close to a specified hour if it is within 8 minutes.
   * This was calculated using the height of an hour (Layout.spacing.xxxlarge)
   * and the height of the time texts.
   */
  const currentTimeClose = (currTime: Timestamp, hour: number) => {
    const now = currTime.toDate();
    if (now.getHours() === hour - 1) {
      return now.getMinutes() > 52;
    } else if (now.getHours() === hour) {
      return now.getMinutes() < 8;
    }
    return false;
  };

  return (
    <View
      style={[
        {
          marginTop: Layout.spacing.medium,
          backgroundColor: "transparent",
        },
      ]}
    >
      {times.map((time, i) => (
        <View
          style={[
            AppStyles.row,
            {
              height: Layout.spacing.xxxlarge,
              backgroundColor: "transparent",
            },
          ]}
          key={i}
        >
          <Text
            style={[
              styles.gridTimeText,
              today === index && currentTimeClose(currTime, time)
                ? { color: "transparent" }
                : { color: Colors[colorScheme].secondaryText },
            ]}
          >
            {((time - 1) % 12) + 1} {time % 24 > 11 ? "PM" : "AM"}
          </Text>
          <View
            style={[
              styles.gridLine,
              {
                backgroundColor: Colors[colorScheme].secondaryText,
              },
            ]}
          />
        </View>
      ))}
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
