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
import { useNavigation } from "@react-navigation/core";

export default function Calendar({ events }: { events: [] }) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  /* Create new data structure with ref property. */
  const newEvents = events.map((item) => ({ ...item, ref: createRef() }));

  const { width } = Dimensions.get("screen");
  const dayWidth = width - 2 * Layout.spacing.medium;
  const scrollX = useRef(new Animated.Value(0)).current;

  const d = new Date();
  const today = d.getDay() - 1;

  /* Default to selecting Monday if today is a weekend. */
  const [selected, setSelected] = useState(
    today >= 0 && today <= 4 ? today : 0
  );

  const times = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

  const getTimeString = (startTime: Timestamp, endTime: Timestamp) => {
    var start = startTime.toDate().toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    var end = endTime.toDate().toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    return `${start} - ${end}`;
  };

  const getCurrentTimeString = () => {
    const now = Timestamp.now().toDate();
    return `${now.getHours()}:${now.getMinutes()}`;
  };

  const getMarginTop = (time: Timestamp) => {
    const offset = Layout.spacing.medium + Layout.spacing.xxlarge / 2;
    const t = time.toDate();
    const hourDiff = t.getHours() - times[0];

    return (
      offset +
      hourDiff * Layout.spacing.xxlarge +
      (t.getMinutes() * Layout.spacing.xxlarge) / 60
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
      hourDiff * Layout.spacing.xxlarge +
      (minDiff * Layout.spacing.xxlarge) / 60
    );
  };

  const DayTab = forwardRef(({ day, i, onItemPress }, ref) => {
    const inputRange = [0, 1, 2, 3, 4].map((num) => num * dayWidth);
    const regularOpacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 2, 3, 4].map((num) => (num === i ? 0 : 1)),
    });
    const selectedOpacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 2, 3, 4].map((num) => (num === i ? 1 : 0)),
    });

    console.log("inputRange:", inputRange);

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
                ? { color: Colors.red }
                : { color: Colors[colorScheme].text },
            ]}
          >
            {day}
          </Animated.Text>
          <Animated.Text
            style={[
              {
                opacity: selectedOpacity,
                fontWeight: "500",
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
        {/* <View
          style={[
            styles.day,
            selected === i
              ? today === i
                ? { backgroundColor: Colors.red }
                : { backgroundColor: Colors[colorScheme].text }
              : null,
          ]}
        >
          <Text
            style={
              today === i
                ? selected === i
                  ? { color: Colors.white, fontWeight: "500" }
                  : { color: Colors.red }
                : selected === i
                ? {
                    color: Colors[colorScheme].background,
                    fontWeight: "500",
                  }
                : { color: Colors[colorScheme].text }
            }
          >
            {day}
          </Text>
        </View> */}
      </Pressable>
    );
  });

  const Indicator = ({ measurements, scrollX }) => {
    const inputRange = measurements.map((_, i) => i * dayWidth);
    const indicatorLeft = scrollX.interpolate({
      inputRange,
      outputRange: measurements.map(
        (measurement) => measurement.x + measurement.width / 2 - 15
      ),
    });

    return (
      <Animated.View
        style={[
          styles.indicator,
          { left: indicatorLeft, backgroundColor: Colors[colorScheme].text },
        ]}
      />
    );
  };

  const Header = ({ data, scrollX, onItemPress }) => {
    const [measurements, setMeasurements] = useState([]);
    const containerRef = useRef();

    useEffect(() => {
      let m = [];
      data.forEach((item) => {
        item.ref.current.measureLayout(
          containerRef.current,
          (x, y, width, height) => {
            m.push({ x, y, width, height });

            if (m.length === data.length) setMeasurements(m);
          }
        );
      });
    }, []);

    return (
      <View>
        {measurements.length > 0 && (
          <Indicator measurements={measurements} scrollX={scrollX} />
        )}
        <View
          style={[
            AppStyles.row,
            {
              justifyContent: "space-between",
              marginBottom: Layout.spacing.medium,
            },
          ]}
          ref={containerRef}
        >
          {data.map((item, i) => {
            return (
              <DayTab
                key={i}
                day={item.day[0]}
                i={i}
                ref={item.ref}
                onItemPress={() => onItemPress(i)}
              />
            );
          })}
        </View>
      </View>
    );
  };

  const Grid = () => {
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
                height: Layout.spacing.xxlarge,
                backgroundColor: "transparent",
              },
            ]}
            key={i}
          >
            <Text
              style={{
                color: Colors[colorScheme].secondaryText,
                fontWeight: "600",
                width: 45,
                textAlign: "right",
                paddingRight: 10,
                fontSize: Layout.text.small,
                backgroundColor: "transparent",
              }}
            >
              {((time - 1) % 12) + 1} {time > 11 ? "PM" : "AM"}
            </Text>
            <View
              style={{
                flex: 1,
                height: 1,
                borderRadius: 1,
                backgroundColor: Colors[colorScheme].secondaryText,
              }}
            />
          </View>
        ))}
        {/* TODO: only render this if it's between 8AM and 6PM */}
        <View
          style={[
            AppStyles.row,
            { position: "absolute", marginTop: getMarginTop(Timestamp.now()) },
          ]}
        >
          <Text
            style={{
              color: Colors.red,
              fontWeight: "600",
              width: 45,
              textAlign: "right",
              paddingRight: 10,
              fontSize: Layout.text.small,
              backgroundColor: "transparent",
            }}
          >
            {getCurrentTimeString()}
          </Text>
          <View
            style={{
              flex: 1,
              height: 1,
              borderRadius: 1,
              backgroundColor: Colors.red,
            }}
          />
        </View>
      </View>
    );
  };

  const Day = ({ events }) => {
    return (
      <View style={{ width: dayWidth }}>
        <Grid />
        {events.map((event, i) => {
          /* Handle overlapping events by indenting. */
          let leftIndent = 0;
          let prevIndex = i - 1;
          let currIndex = i;
          while (prevIndex >= 0) {
            const prevEndTime = events[prevIndex].endInfo;
            const currStartTime = events[currIndex].startInfo;
            if (prevEndTime > currStartTime) {
              leftIndent += Layout.spacing.xsmall;
              currIndex = prevIndex;
            }
            prevIndex--;
          }

          return (
            <CalendarEvent
              title={event.title}
              time={getTimeString(event.startInfo, event.endInfo)}
              location={event.location}
              marginTop={getMarginTop(event.startInfo)}
              height={getHeight(event.startInfo, event.endInfo)}
              leftIndent={leftIndent}
              onPress={() =>
                navigation.navigate("Course", { id: event.courseId })
              }
              key={i}
            />
          );
        })}
      </View>
    );
  };

  const ref = useRef();

  useEffect(() => {
    if (ref && ref.current) {
      ref.current.scrollToOffset({
        offset: today * dayWidth,
      });
    }
  }, []);

  const onItemPress = useCallback((itemIndex) => {
    if (ref && ref.current)
      ref.current.scrollToOffset({
        offset: itemIndex * dayWidth,
      });
    setSelected(itemIndex);
  });

  return (
    <>
      <Header data={newEvents} scrollX={scrollX} onItemPress={onItemPress} />
      <Animated.FlatList
        ref={ref}
        data={newEvents}
        keyExtractor={(item: Object) => item.day}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        bounces={false}
        renderItem={({ item }) => <Day events={item.events} />}
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
    backgroundColor: "blue",
  },
});
