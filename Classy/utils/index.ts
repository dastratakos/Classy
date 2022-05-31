import { Enrollment, Event, WeekSchedule } from "../types";

import { Timestamp } from "firebase/firestore";

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
    Saturday: 5,
    Sunday: 6,
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

      if (schedule.startInfo) {
        const startHour = schedule.startInfo.toDate().getHours();
        /* startHour !== 0 filters for sections that are 12:00 AM - 12:00 AM. */
        if (startHour < startCalendarHour && startHour !== 0)
          startCalendarHour = startHour;
      }
      if (schedule.endInfo) {
        const endHour = schedule.endInfo.toDate().getHours() + 1;
        if (endHour > endCalendarHour) endCalendarHour = endHour;
      }

      for (let day of schedule.days) {
        const index = dayIndices[`${day}`];
        week[index].events.push(event);
      }
    }
  }

  for (let i = 0; i < week.length; i++) {
    week[i].events = week[i].events.sort((a: Event, b: Event) => {
      if (!a.startInfo) return 1;
      if (!b.startInfo) return -1;

      /* Sort by ascending start times. */
      const aDate = a.startInfo.toDate();
      const bDate = b.startInfo.toDate();
      if (aDate.getHours() === bDate.getHours()) {
        if (aDate.getMinutes() === bDate.getMinutes()) {
          if (!a.endInfo) return 1;
          if (!b.endInfo) return -1;
          /* If start times are the same, sort by descending end times. */
          const aEndDate = a.endInfo.toDate();
          const bEndDate = b.endInfo.toDate();
          if (aEndDate.getHours() === bEndDate.getHours())
            return aEndDate.getMinutes() < bDate.getMinutes() ? 1 : -1;
          return aEndDate.getHours() < bEndDate.getHours() ? 1 : -1;
        }
        return aDate.getMinutes() > bDate.getMinutes() ? 1 : -1;
      }
      return aDate.getHours() > bDate.getHours() ? 1 : -1;
    });
  }

  console.log("week:", week);

  return { week, startCalendarHour, endCalendarHour };
};
