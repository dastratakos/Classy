import { Timestamp } from "firebase/firestore";

export const generateSubstrings = (text: string) => {
  let substrings: string[] = [];
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
  return timestamp.toDate().toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: timeZone,
  });
};

export const majorList = [
  "Aerospace, aeronautical and astronautical/space engineering",
  "African-american/black studies",
  "American indian/native american studies",
  "American/united states studies/civilization",
  "Anthropology",
  "Applied mathematics",
  "Archeology",
  "Area studies",
  "Art history, criticism and conservation",
  "Art/art studies",
  "Asian-american studies",
  "Bioengineering and biomedical engineering",
  "Biology/biological sciences",
  "Chemical engineering",
  "Chemistry",
  "Civil engineering",
  "Classics and classical languages, literatures, and linguistics",
  "Cognitive science",
  "Communication and media studies",
  "Comparative literature",
  "Computer science",
  "Drama and dramatics/theatre arts",
  "East asian studies",
  "Econometrics and quantitative economics",
  "Electrical and electronics engineering",
  "Engineering",
  "Engineering/industrial management",
  "English language and literature",
  "Environmental/environmental health engineering",
  "Ethnic, cultural minority, gender, and group studies",
  "Film/cinema/video studies",
  "Fine/studio arts",
  "French language and literature",
  "Geological and earth sciences/geosciences",
  "Geology/earth science",
  "German language and literature",
  "Hispanic-american, puerto rican, and mexican-american/chicano studies",
  "History",
  "Human biology",
  "International relations and affairs",
  "Italian language and literature",
  "Japanese language and literature",
  "Linguistics",
  "Materials engineering",
  "Mathematics",
  "Mechanical engineering",
  "Music",
  "Philosophy and religious studies",
  "Philosophy",
  "Physics",
  "Political science and government",
  "Public policy analysis",
  "Religion/religious studies",
  "Research and experimental psychology",
  "Russian language and literature",
  "Science, technology and society",
  "Sociology",
  "Spanish language and literature",
  "Urban studies/affairs",
];
