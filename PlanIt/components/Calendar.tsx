import { Pressable, StyleSheet } from "react-native";
import { Text, View } from "./Themed";

import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { useNavigation } from "@react-navigation/core";
import useColorScheme from "../hooks/useColorScheme";
import { useEffect, useState } from "react";
import AppStyles from "../styles/AppStyles";
import { Course } from "../types";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import CalendarEvent from "./CalendarEvent";

export default function Calendar({ courses }: { courses: Course[] }) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const [events, setEvents] = useState();

  const dayInitials = ["M", "T", "W", "T", "F"];

  const dummyEvents = {
    Monday: [
      {
        title: "CS 194W",
        startTime: "14:45",
        endTime: "15:45",
        location: "Hewlett Teaching Center 200",
      },
      {
        title: "PSYC 135",
        startTime: "13:30",
        endTime: "15:00",
        location: "Building 420, Rm 40",
      },
    ],
    Tuesday: [],
    Wednesday: [
      {
        title: "CS 194W",
        startTime: "14:45",
        endTime: "15:45",
        location: "Hewlett Teaching Center 200",
      },
      {
        title: "PSYC 135",
        startTime: "13:30",
        endTime: "15:00",
        location: "Building 420, Rm 40",
      },
    ],
    Thursday: [],
    Friday: [],
  };

  const [course, setCourse] = useState({} as Course);
  const [courseDays, setCourseDays] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [marginTop, setMarginTop] = useState(0);
  const [height, setHeight] = useState(0);

  const d = new Date();
  const today = d.getDay() - 1;

  // default to selecting Monday if today is a weekend
  const [selected, setSelected] = useState(
    today >= 0 && today <= 4 ? today : 0
  );

  const times = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

  useEffect(() => {
    console.log("printing courses");
    for (let course of courses) {
      // console.log("course:", course);
      setCourse(course);
    }
    getSchedules();
  }, [courses]);

  const getSchedules = async () => {
    // 08Pkc17zRpdT3LwQWOWQ course
    // m2G5v5H4twqUZpkVd3gh section
    // 57SYlw3YdAFt0L0rRCla schedule

    const docRef = doc(
      db,
      "courses",
      "08Pkc17zRpdT3LwQWOWQ",
      "sections",
      "m2G5v5H4twqUZpkVd3gh",
      "schedules",
      "57SYlw3YdAFt0L0rRCla"
    );
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // console.log("got data", docSnap.data());
      const schedule = docSnap.data();
      const days = schedule.days;
      const location = schedule.location;
      const startDate = schedule.startDate.toDate();
      const endDate = schedule.endDate.toDate();
      const startTime = schedule.startTime.toDate();
      const endTime = schedule.endTime.toDate();

      const startTimeString = `${startTime.getHours()}:${String(
        startTime.getMinutes()
      ).padStart(2, "0")}`;
      const endTimeString = `${endTime.getHours()}:${String(
        endTime.getMinutes()
      ).padStart(2, "0")}`;

      setCourseDays(days);
      setStartTime(startTimeString);
      setEndTime(endTimeString);
      setLocation(location);
      setMarginTop(getMarginTop(startTime));
      setHeight(getHeight(startTime, endTime));

      // console.log(days);
      // console.log(
      //   `start time: ${startTime.getHours()}:${startTime.getMinutes()}`
      // );
      // console.log(`end time: ${endTime.getHours()}:${endTime.getMinutes()}`);
    } else {
      console.log("Could not find schedule");
    }
  };

  const getMarginTop = (time: Date) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();

    const firstHour = times[0];
    const hourDiff = hours - firstHour;

    const offset = Layout.spacing.medium + Layout.spacing.xxlarge / 2;

    return (
      offset +
      hourDiff * Layout.spacing.xxlarge +
      (minutes * Layout.spacing.xxlarge) / 60
    );
  };

  const getHeight = (startTime: Date, endTime: Date) => {
    const startHours = startTime.getHours();
    const startMinutes = startTime.getMinutes();
    const endHours = endTime.getHours();
    const endMinutes = endTime.getMinutes();

    const hourDiff = endHours - startHours;
    const minDiff = endMinutes - startMinutes;

    return (
      hourDiff * Layout.spacing.xxlarge +
      (minDiff * Layout.spacing.xxlarge) / 60
    );
  };

  return (
    <>
      <View style={[AppStyles.row, { justifyContent: "space-between" }]}>
        {dayInitials.map((day, i) => (
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
        ))}
      </View>
      <View>
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
        {course ? (
          <CalendarEvent
            title={course.code}
            time={`${startTime}-${endTime}`}
            location={location}
            marginTop={marginTop}
            height={height}
            onPress={() => console.log("CalendarEvent pressed")}
          />
        ) : null}
      </View>
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
