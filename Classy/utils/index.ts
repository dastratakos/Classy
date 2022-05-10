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
  return timestamp.toDate().toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: timeZone,
  });
};

export const majorList = [
  {
    label: "Aerospace, aeronautical and astronautical/space engineering",
    value: "Aerospace, aeronautical and astronautical/space engineering",
  },
  {
    label: "African-american/black studies",
    value: "African-american/black studies",
  },
  {
    label: "American indian/native american studies",
    value: "American indian/native american studies",
  },
  {
    label: "American/united states studies/civilization",
    value: "American/united states studies/civilization",
  },
  { label: "Anthropology", value: "Anthropology" },
  { label: "Applied mathematics", value: "Applied mathematics" },
  { label: "Archeology", value: "Archeology" },
  { label: "Area studies", value: "Area studies" },
  {
    label: "Art history, criticism and conservation",
    value: "Art history, criticism and conservation",
  },
  { label: "Art/art studies", value: "Art/art studies" },
  { label: "Asian-american studies", value: "Asian-american studies" },
  {
    label: "Bioengineering and biomedical engineering",
    value: "Bioengineering and biomedical engineering",
  },
  {
    label: "Biology/biological sciences",
    value: "Biology/biological sciences",
  },
  { label: "Chemical engineering", value: "Chemical engineering" },
  { label: "Chemistry", value: "Chemistry" },
  { label: "Civil engineering", value: "Civil engineering" },
  {
    label: "Classics and classical languages, literatures, and linguistics",
    value: "Classics and classical languages, literatures, and linguistics",
  },
  { label: "Cognitive science", value: "Cognitive science" },
  {
    label: "Communication and media studies",
    value: "Communication and media studies",
  },
  { label: "Comparative literature", value: "Comparative literature" },
  { label: "Computer Science", value: "Computer Science" },
  {
    label: "Drama and dramatics/theatre arts",
    value: "Drama and dramatics/theatre arts",
  },
  { label: "East asian studies", value: "East asian studies" },
  {
    label: "Econometrics and quantitative economics",
    value: "Econometrics and quantitative economics",
  },
  {
    label: "Electrical and electronics engineering",
    value: "Electrical and electronics engineering",
  },
  { label: "Engineering", value: "Engineering" },
  {
    label: "Engineering/industrial management",
    value: "Engineering/industrial management",
  },
  {
    label: "English language and literature",
    value: "English language and literature",
  },
  {
    label: "Environmental/environmental health engineering",
    value: "Environmental/environmental health engineering",
  },
  {
    label: "Ethnic, cultural minority, gender, and group studies",
    value: "Ethnic, cultural minority, gender, and group studies",
  },
  { label: "Film/cinema/video studies", value: "Film/cinema/video studies" },
  { label: "Fine/studio arts", value: "Fine/studio arts" },
  {
    label: "French language and literature",
    value: "French language and literature",
  },
  {
    label: "Geological and earth sciences/geosciences",
    value: "Geological and earth sciences/geosciences",
  },
  { label: "Geology/earth science", value: "Geology/earth science" },
  {
    label: "German language and literature",
    value: "German language and literature",
  },
  {
    label:
      "Hispanic-american, puerto rican, and mexican-american/chicano studies",
    value:
      "Hispanic-american, puerto rican, and mexican-american/chicano studies",
  },
  { label: "History", value: "History" },
  { label: "Human biology", value: "Human biology" },
  {
    label: "International relations and affairs",
    value: "International relations and affairs",
  },
  {
    label: "Italian language and literature",
    value: "Italian language and literature",
  },
  {
    label: "Japanese language and literature",
    value: "Japanese language and literature",
  },
  { label: "Linguistics", value: "Linguistics" },
  { label: "Materials engineering", value: "Materials engineering" },
  { label: "Mathematics", value: "Mathematics" },
  { label: "Mechanical engineering", value: "Mechanical engineering" },
  { label: "Music", value: "Music" },
  {
    label: "Philosophy and religious studies",
    value: "Philosophy and religious studies",
  },
  { label: "Philosophy", value: "Philosophy" },
  { label: "Physics", value: "Physics" },
  {
    label: "Political science and government",
    value: "Political science and government",
  },
  { label: "Public policy analysis", value: "Public policy analysis" },
  { label: "Religion/religious studies", value: "Religion/religious studies" },
  {
    label: "Research and experimental psychology",
    value: "Research and experimental psychology",
  },
  {
    label: "Russian language and literature",
    value: "Russian language and literature",
  },
  {
    label: "Science, technology and society",
    value: "Science, technology and society",
  },
  { label: "Sociology", value: "Sociology" },
  {
    label: "Spanish language and literature",
    value: "Spanish language and literature",
  },
  { label: "Urban studies/affairs", value: "Urban studies/affairs" },
];

export const gradYearList = [
  {label: 2018, value: 2018},
  {label: 2019, value: 2019},
  {label: 2020, value: 2020},
  {label: 2021, value: 2021},
  {label: 2022, value: 2022},
  {label: 2023, value: 2023},
  {label: 2024, value: 2024},
]