import { Timestamp } from "firebase/firestore";
import { Day, Enrollment, Event, WeekSchedule } from "../types";

export const generateSubstrings = (text: string) => {
  let substrings: string[] = [];

  if (!text) return substrings;

  const pieces = text.toLowerCase().split(" ");
  for (let i = 0; i < pieces.length; i++) {
    let substr = "";
    for (let ch of pieces.slice(i).join(" ")) {
      substr += ch;
      substrings.push(substr);
    }
  }
  return substrings;
};

export const sendPushNotification = async (
  expoPushToken: string,
  body: string = ""
) => {
  if (!expoPushToken) return;

  const message = {
    to: expoPushToken,
    sound: "default",
    title: "Classy",
    body: body,
    data: {},
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
};

export const getCurrentTermId = () => {
  const now = new Date();
  const year = now.getFullYear();

  // TODO: calculate this value. This will also affect year (e.g. 2021 vs 2022)
  const quarter = 6;

  return `${(year - 1900) * 10 + quarter}`;
};

export const termIdToName = (termId: string) => {
  let name = "";

  const year = Math.floor(parseInt(termId) / 10) + 1900;
  name += `${year - 1}-${year % 100} `;

  const quarter = parseInt(termId) % 10;
  if (quarter === 2) {
    name += "Aut";
  } else if (quarter === 4) {
    name += "Win";
  } else if (quarter === 6) {
    name += "Spr";
  } else if (quarter === 8) {
    name += "Sum";
  }

  return name;
};

export const termIdToFullName = (termId: string) => {
  let name = "";

  const year = Math.floor(parseInt(termId) / 10) + 1900;
  name += `${year - 1}-${year % 100} `;

  const quarter = parseInt(termId) % 10;
  if (quarter === 2) {
    name += "Autumn";
  } else if (quarter === 4) {
    name += "Winter";
  } else if (quarter === 6) {
    name += "Spring";
  } else if (quarter === 8) {
    name += "Summer";
  }

  return name;
};

export const termIdToYear = (termId: string) => {
  const year = Math.floor(parseInt(termId) / 10) + 1900;
  return `${year - 1}-${year % 100}`;
};

export const termIdToQuarterName = (termId: string) => {
  const quarter = parseInt(termId) % 10;
  if (quarter === 2) {
    return "Aut";
  } else if (quarter === 4) {
    return "Win";
  } else if (quarter === 6) {
    return "Spr";
  } else if (quarter === 8) {
    return "Sum";
  }
  return "";
};

export const componentToName = (component: string) => {
  const map = {
    LEC: "Lecture",
    SEM: "Seminar",
    DIS: "Discussion Section",
    LAB: "Laboratory",
    LBS: "Lab Section",
    ACT: "Activity",
    CAS: "Case Study",
    COL: "Colloquium",
    WKS: "Workshop",
    INS: "Independent Study",
    IDS: "Intro Dial, Sophomore",
    ISF: "Intro Sem, Freshman",
    ISS: "Intro Sem, Sophomore",
    ITR: "Internship",
    API: "Arts Intensive Program",
    LNG: "Language",
    CLK: "Clerkship",
    PRA: "Practicum",
    PRC: "Practicum",
    RES: "Research",
    SCS: "Sophomore College",
    "T/D": "Thesis/Dissertation",
  };

  if (component in map) return map[component];

  return component;
};

export const getTimeString = (
  timestamp: Timestamp,
  timeZone: string = "America/Los_Angeles"
) => {
  if (!timestamp) return "";

  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleString("en-US", {
    // return timestamp.toDate().toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: timeZone,
  });
};

export const getWeekFromEnrollments = (enrollments: Enrollment[]) => {
  let week: WeekSchedule = [
    {
      day: "Monday",
      events: [],
    },
    {
      day: "Tuesday",
      events: [],
    },
    {
      day: "Wednesday",
      events: [],
    },
    {
      day: "Thursday",
      events: [],
    },
    {
      day: "Friday",
      events: [],
    },
  ];

  const dayIndices = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
  };

  let startCalendarHour = 8;
  let endCalendarHour = 18;

  for (let enrollment of enrollments) {
    for (let schedule of enrollment.schedules) {
      const title =
        enrollment.code.join(", ") + " " + componentToName(schedule.component);
      const event: Event = {
        title,
        startInfo: schedule.startInfo,
        endInfo: schedule.endInfo,
        location: schedule.location,
        enrollment: enrollment,
      };
      if (
        schedule.startInfo &&
        // TODO: 7 IS BECAUSE OF TIMEZONE ERROR IN FIRESTORE DATABASE
        schedule.startInfo.toDate().getHours() + 7 < startCalendarHour
      )
        startCalendarHour = schedule.startInfo.toDate().getHours() + 7;
      if (
        schedule.endInfo &&
        // TODO: 8 IS BECAUSE OF TIMEZONE ERROR IN FIRESTORE DATABASE
        schedule.endInfo.toDate().getHours() + 8 > endCalendarHour
      )
        endCalendarHour = schedule.endInfo.toDate().getHours() + 8;
      for (let day of schedule.days) {
        const index = dayIndices[`${day}`];
        week[index].events.push(event);
      }
    }
  }

  for (let i = 0; i < week.length; i++) {
    week[i].events.sort((a: Event, b: Event) => a.startInfo > b.startInfo);
  }

  return { week, startCalendarHour, endCalendarHour };
};
