import { Timestamp } from "firebase/firestore";

const events = [
  {
    day: "Monday",
    events: [
      {
        title: "Overlapping event",
        courseId: "none",
        startInfo: Timestamp.fromDate(new Date("March 28, 2022 8:00:00")),
        endInfo: Timestamp.fromDate(new Date("March 28, 2022 10:15:00")),
        location: "Gates Information Sciences, Rm B1",
      },
      {
        title: "Overlapping event",
        courseId: "none",
        startInfo: Timestamp.fromDate(new Date("March 28, 2022 10:00:00")),
        endInfo: Timestamp.fromDate(new Date("March 28, 2022 18:15:00")),
        location: "Gates Information Sciences, Rm B1",
      },
      {
        title: "CS 194W Lecture",
        courseId: "211164",
        startInfo: Timestamp.fromDate(new Date("March 28, 2022 12:15:00")),
        endInfo: Timestamp.fromDate(new Date("March 28, 2022 13:15:00")),
        location: "Gates Information Sciences, Rm B1",
      },
      {
        title: "Overlapping event",
        courseId: "none",
        startInfo: Timestamp.fromDate(new Date("March 28, 2022 12:45:00")),
        endInfo: Timestamp.fromDate(new Date("March 28, 2022 14:15:00")),
        location: "Gates Information Sciences, Rm B1",
      },
      {
        title: "PSYC 135 Lecture",
        courseId: "none",
        startInfo: Timestamp.fromDate(new Date("March 28, 2022 13:30:00")),
        endInfo: Timestamp.fromDate(new Date("March 28, 2022 15:00:00")),
        location: "Building 420, Rm 40",
      },
      {
        title: "CS 224U Lecture",
        courseId: "none",
        startInfo: Timestamp.fromDate(new Date("March 28, 2022 15:15:00")),
        endInfo: Timestamp.fromDate(new Date("March 28, 2022 16:45:00")),
        location: "Hewlett Teaching Center, Rm 201",
      },
    ],
  },
  {
    day: "Tuesday",
    events: [],
  },
  {
    day: "Wednesday",
    events: [
      {
        title: "CS 521 Lecture",
        courseId: "none",
        startInfo: Timestamp.fromDate(new Date("March 30, 2022 11:00:00")),
        endInfo: Timestamp.fromDate(new Date("March 30, 2022 12:00:00")),
        location: "Hewlett Teaching Center, Rm 201",
      },
      {
        title: "CS 194W Lecture",
        courseId: "211164",
        startInfo: Timestamp.fromDate(new Date("March 30, 2022 12:15:00")),
        endInfo: Timestamp.fromDate(new Date("March 30, 2022 13:15:00")),
        location: "Gates Information Sciences, Rm B1",
      },
      {
        title: "PSYC 135 Lecture",
        courseId: "none",
        startInfo: Timestamp.fromDate(new Date("March 30, 2022 13:30:00")),
        endInfo: Timestamp.fromDate(new Date("March 30, 2022 15:00:00")),
        location: "Building 420, Rm 40",
      },
      {
        title: "CS 224U Lecture",
        courseId: "none",
        startInfo: Timestamp.fromDate(new Date("March 30, 2022 15:15:00")),
        endInfo: Timestamp.fromDate(new Date("March 30, 2022 16:45:00")),
        location: "Hewlett Teaching Center, Rm 201",
      },
    ],
  },
  {
    day: "Thursday",
    events: [],
  },
  {
    day: "Friday",
    events: [
      {
        title: "ME 104B Lecture",
        courseId: "08Pkc17zRpdT3LwQWOWQ",
        startInfo: Timestamp.fromDate(new Date("April 1, 2022 11:00:00")),
        endInfo: Timestamp.fromDate(new Date("April 1, 2022 13:00:00")),
        location: "Building 550, Rm 200",
      },
    ],
  },
];

export default events;
