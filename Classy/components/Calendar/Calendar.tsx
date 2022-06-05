import { Animated, Pressable, StyleSheet, View } from "react-native";
import { DaySchedule, Event, WeekSchedule } from "../../types";
import { createRef, forwardRef, useCallback, useRef } from "react";

import { ActivityIndicator } from "../Themed";
import AppStyles from "../../styles/AppStyles";
import CalendarCurrTime from "./CalendarCurrTime";
import CalendarEvent from "./CalendarEvent";
import CalendarGrid from "./CalendarGrid";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import { getStyledEvents } from "./layout";
import useColorScheme from "../../hooks/useColorScheme";

const CALENDAR_TIMES_WIDTH = 45;
const CALENDAR_HOUR_HEIGHT = Layout.spacing.xxxlarge;

export default function Calendar({
  week,
  startCalendarHour,
  endCalendarHour,
}: {
  week: WeekSchedule;
  startCalendarHour: number;
  endCalendarHour: number;
}) {
  const colorScheme = useColorScheme();

  const ref = useRef();

  /* Create new data structure with ref property. */
  const newEvents = week.map((item) => ({ ...item, ref: createRef() }));

  const DAY_WIDTH = Layout.window.width - 2 * Layout.spacing.medium;
  const scrollX = useRef(new Animated.Value(0)).current;

  const d = new Date();
  const today = d.getDay() - 1;

  const times = Array.from(
    { length: endCalendarHour - startCalendarHour + 1 },
    (_, i) => i + startCalendarHour
  );

  const DayTab = forwardRef(
    (
      {
        day,
        numDays,
        i,
        onItemPress,
      }: { day: string; numDays: number; i: number; onItemPress: () => void },
      ref
    ) => {
      const inputRange = Array.from(
        { length: numDays },
        (_, idx) => idx * DAY_WIDTH
      );
      const regularOpacity = scrollX.interpolate({
        inputRange,
        outputRange: Array.from({ length: numDays }, (_, idx) =>
          idx === i ? 0 : 1
        ),
      });
      const selectedOpacity = scrollX.interpolate({
        inputRange,
        outputRange: Array.from({ length: numDays }, (_, idx) =>
          idx === i ? 1 : 0
        ),
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

  const Indicator = ({
    numDays,
    scrollX,
  }: {
    numDays: number;
    scrollX: Animated.Value;
  }) => {
    const inputRange = Array.from(
      { length: numDays },
      (_, idx) => idx * DAY_WIDTH
    );
    const indicatorLeft = scrollX.interpolate({
      inputRange,
      outputRange: Array.from(
        { length: numDays },
        (_, idx) => (idx * DAY_WIDTH) / numDays + DAY_WIDTH / numDays / 2 - 15
      ),
    });
    const regularOpacity = scrollX.interpolate({
      inputRange,
      outputRange: Array.from({ length: numDays }, (_, idx) =>
        today === idx ? 0 : 1
      ),
    });
    const selectedOpacity = scrollX.interpolate({
      inputRange,
      outputRange: Array.from({ length: numDays }, (_, idx) =>
        today === idx ? 1 : 0
      ),
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
        <Indicator numDays={data.length} scrollX={scrollX} />
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
              numDays={data.length}
              i={i}
              ref={item.ref}
              onItemPress={() => onItemPress(i)}
            />
          ))}
        </View>
      </View>
    );
  };

  const Day = ({ events, index }: { events: Event[]; index: number }) => {
    const styledEvents = getStyledEvents(
      events,
      startCalendarHour,
      CALENDAR_HOUR_HEIGHT,
      DAY_WIDTH,
      CALENDAR_TIMES_WIDTH,
      Layout.spacing.xsmall
    );

    return (
      <View style={{ width: DAY_WIDTH }}>
        <CalendarGrid
          times={times}
          index={index}
          today={today}
          timesWidth={CALENDAR_TIMES_WIDTH}
          hourHeight={CALENDAR_HOUR_HEIGHT}
        />
        {/* {styledEvents.map(({ event: Event, style: Object }, i: number) => ( */}
        {styledEvents.map((styledEvent, i: number) => (
          <CalendarEvent
            event={styledEvent.event}
            height={styledEvent.style.height}
            width={styledEvent.style.width}
            top={styledEvent.style.top}
            left={styledEvent.style.left}
            key={i}
          />
        ))}
        {today === index && (
          <CalendarCurrTime
            startCalendarHour={startCalendarHour}
            timesWidth={CALENDAR_TIMES_WIDTH}
            hourHeight={CALENDAR_HOUR_HEIGHT}
          />
        )}
      </View>
    );
  };

  const onItemPress = useCallback((itemIndex) => {
    ref?.current?.scrollToOffset({
      offset: itemIndex * DAY_WIDTH,
    });
  });

  if (week.length === 0) return <ActivityIndicator />;

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
        onLayout={() => {
          /* Default to Monday if it's a weekend. */
          const initialSelected = today >= 0 && today <= 4 ? today : 0;
          ref?.current?.scrollToOffset({
            offset: initialSelected * DAY_WIDTH,
            animated: false,
          });
        }}
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
});
