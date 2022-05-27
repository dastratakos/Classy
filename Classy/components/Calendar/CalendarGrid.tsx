import { useEffect, useState } from "react";

import AppStyles from "../../styles/AppStyles";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import { Text } from "./../Themed";
import { Timestamp } from "firebase/firestore";
import { View } from "react-native";
import gridStyles from "./gridStyles";
import useColorScheme from "../../hooks/useColorScheme";

export default function CalendarGrid({
  times,
  index,
  today,
  timesWidth,
}: {
  times: number[];
  index: number;
  today: number;
  timesWidth: number;
}) {
  const colorScheme = useColorScheme();

  const [currTime, setCurrTime] = useState<Timestamp>(Timestamp.now());

  useEffect(() => {
    const interval = setInterval(() => setCurrTime(Timestamp.now()), 1000);
    return () => clearInterval(interval);
  }, []);

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
              gridStyles.gridTimeText,
              { width: timesWidth },
              today === index && currentTimeClose(currTime, time)
                ? { color: "transparent" }
                : { color: Colors[colorScheme].secondaryText },
            ]}
          >
            {((time - 1) % 12) + 1} {time % 24 > 11 ? "PM" : "AM"}
          </Text>
          <View
            style={[
              gridStyles.gridLine,
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
