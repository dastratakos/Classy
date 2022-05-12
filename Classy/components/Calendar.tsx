import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import {
  createRef,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import AppStyles from "../styles/AppStyles";
import CalendarEvent from "./CalendarEvent";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { Text } from "./Themed";
import { Timestamp } from "firebase/firestore";
import useColorScheme from "../hooks/useColorScheme";
import { DaySchedule, Event, WeekSchedule } from "../types";

export default function Calendar({ week }: { week: WeekSchedule }) {
  const colorScheme = useColorScheme();

  const ref = useRef();

  /* Create new data structure with ref property. */
  const newEvents = week.map((item) => ({ ...item, ref: createRef() }));

  const { width } = Dimensions.get("screen");
  const dayWidth = width - 2 * Layout.spacing.medium;
  const scrollX = useRef(new Animated.Value(0)).current;

  const d = new Date();
  const today = d.getDay() - 1;

  // TODO: compute earliest and latest events for all days ahead of time
  // earliest Stanford course is 6:00 AM and latest is 9:30 PM
  const times = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  const [currTime, setCurrTime] = useState<Timestamp>(Timestamp.now());

  useEffect(() => {
    setInterval(() => setCurrTime(Timestamp.now()), 1000);

    /* Default to Monday if it's a weekend. */
    const initialSelected = today >= 0 && today <= 4 ? today : 0;
    console.log("initialSelected:", initialSelected);
    ref?.current?.scrollToOffset({
      offset: initialSelected * dayWidth,
      animated: false,
    });
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

  const getHeight = (startTime: Timestamp, endTime: Timestamp) => {
    const startHours = startTime.toDate().getHours();
    const endHours = endTime.toDate().getHours();
    const hourDiff = endHours - startHours;

    const startMinutes = startTime.toDate().getMinutes();
    const endMinutes = endTime.toDate().getMinutes();
    const minDiff = endMinutes - startMinutes;

    return (
      hourDiff * Layout.spacing.xxxlarge +
      (minDiff * Layout.spacing.xxxlarge) / 60
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

  const DayTab = forwardRef(
    (
      {
        day,
        i,
        onItemPress,
      }: { day: string; i: number; onItemPress: () => void },
      ref
    ) => {
      const inputRange = [0, 1, 2, 3, 4].map((num) => num * dayWidth);
      const regularOpacity = scrollX.interpolate({
        inputRange,
        outputRange: [0, 1, 2, 3, 4].map((num) => (num === i ? 0 : 1)),
      });
      const selectedOpacity = scrollX.interpolate({
        inputRange,
        outputRange: [0, 1, 2, 3, 4].map((num) => (num === i ? 1 : 0)),
      });

      return (
        <Pressable
          style={{ flex: 1, alignItems: "center" }}
          onPress={onItemPress}
          ref={ref}
        >
          <View style={styles.day}>
            <Animated.Text
              style={[
                { opacity: regularOpacity },
                today === i
                  ? { color: Colors.pink }
                  : { color: Colors[colorScheme].text },
              ]}
            >
              {day}
            </Animated.Text>
            <Animated.Text
              style={[
                {
                  opacity: selectedOpacity,
                  fontWeight: "700",
                  position: "absolute",
                },
                today === i
                  ? { color: Colors.white }
                  : { color: Colors[colorScheme].background },
              ]}
            >
              {day}
            </Animated.Text>
          </View>
        </Pressable>
      );
    }
  );

  const Indicator = ({ scrollX }: { scrollX: Animated.Value }) => {
    const inputRange = [0, 1, 2, 3, 4].map((i) => i * dayWidth);
    const indicatorLeft = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 2, 3, 4].map(
        (i) => (i * dayWidth) / 5 + dayWidth / 5 / 2 - 15
      ),
    });
    const regularOpacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 2, 3, 4].map((i) => (today === i ? 0 : 1)),
    });
    const selectedOpacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 2, 3, 4].map((i) => (today === i ? 1 : 0)),
    });

    return (
      <>
        <Animated.View
          style={[
            styles.indicator,
            {
              left: indicatorLeft,
              backgroundColor: Colors[colorScheme].text,
              opacity: regularOpacity,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.indicator,
            {
              position: "absolute",
              left: indicatorLeft,
              backgroundColor: Colors.pink,
              opacity: selectedOpacity,
            },
          ]}
        />
      </>
    );
  };

  const Header = ({
    data,
    scrollX,
    onItemPress,
  }: {
    data: WeekSchedule;
    scrollX: Animated.Value;
    onItemPress: (arg0: number) => {};
  }) => {
    return (
      <View>
        <Indicator scrollX={scrollX} />
        <View
          style={[
            AppStyles.row,
            {
              justifyContent: "space-between",
              marginBottom: Layout.spacing.medium,
            },
          ]}
        >
          {data.map((item: DaySchedule, i) => (
            <DayTab
              key={i}
              day={item.day[0]}
              i={i}
              ref={item.ref}
              onItemPress={() => onItemPress(i)}
            />
          ))}
        </View>
      </View>
    );
  };

  const Grid = ({ index }: { index: number }) => {
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
              {((time - 1) % 12) + 1} {time > 11 ? "PM" : "AM"}
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
  };

  const Day = ({ events, index }: { events: Event[]; index: number }) => {
    return (
      <View style={{ width: dayWidth }}>
        <Grid index={index} />
        {today === index && (
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
        )}
        {events.map((event: Event, i: number) => {
          /* Handle overlapping events by indenting. */
          let leftIndent = 0;
          // let prevIndex = i - 1;
          // let currIndex = i;
          // while (prevIndex >= 0) {
          //   const prevEndTime = events[prevIndex].endInfo;
          //   const currStartTime = events[currIndex].startInfo;
          //   if (prevEndTime > currStartTime) {
          //     leftIndent += Layout.spacing.xsmall;
          //     currIndex = prevIndex;
          //   }
          //   prevIndex--;
          // }

          return (
            <CalendarEvent
              event={event}
              // TODO: 7 IS BECAUSE OF TIMEZONE ERROR IN FIRESTORE DATABASE
              marginTop={getMarginTop(event.startInfo, 7)}
              height={getHeight(event.startInfo, event.endInfo)}
              leftIndent={leftIndent}
              key={i}
            />
          );
        })}
      </View>
    );
  };

  const onItemPress = useCallback((itemIndex) => {
    ref?.current?.scrollToOffset({
      offset: itemIndex * dayWidth,
    });
  });

  return (
    <>
      <Header data={newEvents} scrollX={scrollX} onItemPress={onItemPress} />
      <Animated.FlatList
        ref={ref}
        data={newEvents}
        keyExtractor={(item: DaySchedule) => item.day}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        bounces={false}
        renderItem={({ item, index }) => (
          <Day events={item.events} index={index} />
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  day: {
    alignItems: "center",
    justifyContent: "center",
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
  },
  indicator: {
    position: "absolute",
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
  },
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
