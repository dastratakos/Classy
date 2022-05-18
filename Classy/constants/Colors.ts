const palette = {
  lightRed: "#ff6863",
  red: "#ff3742",
  deepRed: "#cb202d",
  pink: "#ef476f",
  yellow: "#ffd670",
  green: "#20e070",
  lightBlue: "#33c5ff",
  black: "#000000",
  lightBlack: "#111111",
  darkDarkGray: "#1e1e1e",
  darkGray: "#555555",
  gray: "#888888",
  lightGray: "#aaaaaa",
  lightLightGray: "#cccccc",
  lightLightLightGray: "#eeeeee",
  white: "#ffffff",
};

export default {
  light: {
    text: palette.black,
    secondaryText: palette.gray,
    background: palette.white,
    cardBackground: palette.white,
    secondaryBackground: palette.lightLightLightGray,
    tertiaryBackground: palette.lightGray,
    tint: palette.lightBlue,
    tabIconDefault: palette.lightLightGray,
    tabIconSelected: palette.lightBlue,
    border: palette.black,
    photoBackground: palette.lightLightGray,
    overlay: "#00000088",
  },
  dark: {
    text: palette.white,
    secondaryText: palette.gray,
    background: palette.lightBlack,
    cardBackground: palette.darkDarkGray,
    secondaryBackground: palette.darkDarkGray,
    tertiaryBackground: palette.darkGray,
    tint: palette.lightBlue,
    tabIconDefault: palette.lightLightGray,
    tabIconSelected: palette.white,
    border: palette.white,
    photoBackground: palette.gray,
    overlay: "#FFFFFF88",
  },
  status: {
    notInClass: palette.green,
    inClass: palette.red,
  },
  quarters: {
    autumn: "#FFC8A2",
    // autumn: "#FFCAAF",
    winter: "#A0CED9",
    spring: "#ADF7B6",
    // spring: "#D7ECD9",
    summer: "#FFEE93",
  },
  lightRed: palette.lightRed,
  red: palette.red,
  deepRed: palette.deepRed,
  green: palette.green,
  lightBlue: palette.lightBlue,
  black: palette.black,
  white: palette.white,
  pink: palette.pink,
  yellow: palette.yellow,
};

export const enrollmentColors = [
  // "#E64C66",
  palette.pink,
  palette.deepRed,
  "#E0A458",
  // "#FFD166",
  palette.yellow,
  "#06D6A0",
  // "#58FCEC",
  palette.lightBlue,
  "#5E72EB",
  "#DEC0F1",
  "#8783D1",
  "#5B4587",
  "#858585",
];