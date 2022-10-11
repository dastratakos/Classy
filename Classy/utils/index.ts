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
  // TODO: this logic will only hold up until 2023-08-18

  let now = new Date();

  /* https://studentservices.stanford.edu/stanford-academic-calendar-2022-23 */
  const academic_calendar = [
    new Date("2022-09-26"), // aut_start
    new Date("2022-12-09"), // aut_classes_end
    new Date("2022-12-16"), // aut_end

    new Date("2023-01-09"), // win_start
    new Date("2023-03-17"), // win_classes_end
    new Date("2023-03-24"), // win_end

    new Date("2023-04-03"), // spr_start
    new Date("2023-06-07"), // spr_classes_end
    new Date("2023-06-14"), // spr_end

    new Date("2023-06-26"), // sum_start
    new Date("2023-08-17"), // sum_classes_end
    new Date("2023-08-19"), // sum_end
  ];

  let quarter = 2;

  for (let i = 0; i < academic_calendar.length; i++) {
    if (now < academic_calendar[i]) {
      quarter = (Math.floor((i - 1) / 3) + 1) * 2;
      break;
    }
  }

  /* Add one if the quarter is 2 (autumn). E.g. Aut of 2022-23 is year 2023. */
  const year = now.getFullYear() + (quarter === 2 ? 1 : 0);

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

export const getAdjustedDate = (timestamp: Timestamp) => {
  const date = timestamp.toDate();
  const hourOffset =
    (date.getTimezoneOffset() - new Date().getTimezoneOffset()) / 60;
  const adjustedDate = new Date(date.getTime() + hourOffset * 3600 * 1000);

  // if (hourOffset === 1) {
  //   console.log("old time:", date.toTimeString());
  //   console.log("new time:", adjustedDate.toTimeString());
  // }

  return Timestamp.fromDate(adjustedDate);
};

export const getTimeString = (timestamp: Timestamp) => {
  if (!timestamp) return "";

  return timestamp.toDate().toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

export const SECOND_MILLISECONDS = 1000;
export const MINUTE_MILLISECONDS = 60 * SECOND_MILLISECONDS;
export const HOUR_MILLISECONDS = 60 * MINUTE_MILLISECONDS;
export const DAY_MILLISECONDS = 24 * HOUR_MILLISECONDS;
export const WEEK_MILLISECONDS = 7 * DAY_MILLISECONDS;

export const getTimeSinceString = (timestamp: Timestamp) => {
  if (!timestamp) return "";

  const timeDiff = Timestamp.now().toMillis() - timestamp.toMillis();

  // console.log(
  //   "timeDiff:",
  //   timeDiff,
  //   Timestamp.now().toDate().toTimeString(),
  //   timestamp.toDate().toTimeString()
  // );

  if (timeDiff < HOUR_MILLISECONDS) {
    return `${Math.floor(timeDiff / MINUTE_MILLISECONDS + 1)}m`;
  }
  if (timeDiff < DAY_MILLISECONDS) {
    return `${Math.floor(timeDiff / HOUR_MILLISECONDS + 1)}h`;
  }
  if (timeDiff < WEEK_MILLISECONDS) {
    return `${Math.floor(timeDiff / DAY_MILLISECONDS + 1)}d`;
  }
  if (timeDiff < 4 * WEEK_MILLISECONDS) {
    return `${Math.floor(timeDiff / WEEK_MILLISECONDS + 1)}w`;
  }

  const now = Timestamp.now().toDate();
  const then = timestamp.toDate();

  const monthDiff =
    now.getMonth() -
    then.getMonth() +
    12 * (now.getFullYear() - then.getFullYear());

  return `${monthDiff}mo`;
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
      const event: Partial<Event> = {
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
        if (!(day in dayIndices)) {
          console.error(
            `Invalid day ${day} for enrollment with docId ${enrollment.docId}`
          );
          continue;
        }
        const index = dayIndices[`${day}`];
        if (index <= week.length) week[index].events.push(event);
      }
    }
  }

  for (let i = 0; i < week.length; i++) {
    week[i].events = week[i].events.sort((a: Event, b: Event) => {
      if (!a.startInfo) return 1;
      if (!b.startInfo) return -1;

      /* Sort by ascending start times. */
      const aStartDate = a.startInfo.toDate();
      const bStartDate = b.startInfo.toDate();
      if (aStartDate.getHours() === bStartDate.getHours()) {
        if (aStartDate.getMinutes() === bStartDate.getMinutes()) {
          if (!a.endInfo) return 1;
          if (!b.endInfo) return -1;
          /* If start times are the same, sort by descending end times. */
          const aEndDate = a.endInfo.toDate();
          const bEndDate = b.endInfo.toDate();
          if (aEndDate.getHours() === bEndDate.getHours())
            return aEndDate.getMinutes() < bStartDate.getMinutes() ? 1 : -1;
          return aEndDate.getHours() < bEndDate.getHours() ? 1 : -1;
        }
        return aStartDate.getMinutes() > bStartDate.getMinutes() ? 1 : -1;
      }
      return aStartDate.getHours() > bStartDate.getHours() ? 1 : -1;
    });
  }

  // console.log("week:", week);

  return { week, startCalendarHour, endCalendarHour };
};

/**
 * Compares two Timestamps by checking only the hour and minute values. Returns
 * true if a is strictly earlier than b.
 *
 * @param a The first Timestamp object to compare
 * @param b The second Timestamp object to compare
 * @returns boolean true if a's time is earlier, false otherwise
 */
export const timeIsEarlier = (a: Timestamp, b: Timestamp) => {
  const aHours = a.toDate().getHours();
  const bHours = b.toDate().getHours();

  if (aHours !== bHours) return aHours < bHours;

  const aMinutes = a.toDate().getMinutes();
  const bMinutes = b.toDate().getMinutes();

  return aMinutes < bMinutes;
};
