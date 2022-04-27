import { Animated, Dimensions, Pressable, StyleSheet } from "react-native";
import { Text, View } from "./Themed";

import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { useNavigation } from "@react-navigation/core";
import useColorScheme from "../hooks/useColorScheme";
import { useRef, useState } from "react";
import AppStyles from "../styles/AppStyles";
import CalendarEvent from "./CalendarEvent";
import { Timestamp } from "firebase/firestore";

export default function Calendar({ events }: { events: Object }) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const { width } = Dimensions.get("screen");
  const scrollX = useRef(new Animated.Value(0)).current;

  const d = new Date();
  const today = d.getDay() - 1;

  /* Default to selecting Monday if today is a weekend. */
  const [selected, setSelected] = useState(
    today >= 0 && today <= 4 ? today : 0
  );

  const times = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

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

  const DayTab = ({ day, i }) => {
    return (
      <Pressable
        style={{ flex: 1, alignItems: "center" }}
        onPress={() => setSelected(i)}
        key={i}
      >
        <View
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
        </View>
      </Pressable>
    );
  };

  const Header = ({ scrollX }) => {
    const dayInitials = ["M", "T", "W", "T", "F"];

    return (
      <View
        style={[
          AppStyles.row,
          {
            justifyContent: "space-between",
            marginBottom: Layout.spacing.medium,
          },
        ]}
      >
        {dayInitials.map((day, i) => {
          return <DayTab key={i} day={day} i={i} />;
        })}
      </View>
    );
  };

  const Grid = () => {
    return (
      <View
        style={[
          {
            marginTop: Layout.spacing.medium,
            zIndex: 100,
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
      </View>
    );
  };

  const Day = ({ events }) => {
    return (
      // Subtract spacing for AppStyles.section padding
      <View style={{ width: width - 2 * Layout.spacing.medium }}>
        <Grid />
        {events.map((event, i) => {
          return (
            <CalendarEvent
              title={event.title}
              time={""}
              location={event.location}
              marginTop={getMarginTop(event.startInfo)}
              height={getHeight(event.startInfo, event.endInfo)}
              onPress={() =>
                navigation.navigate("Course", { id: event.courseId })
              }
            />
          );
        })}
      </View>
    );
  };

  return (
    <>
      <Header scrollX={scrollX} />
      <Animated.FlatList
        data={events}
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
});
