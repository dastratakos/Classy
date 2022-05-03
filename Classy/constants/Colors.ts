const palette = {
  lightRed: "#ff6863",
  red: "#ff3742",
  deepRed: "#cb202d",
  green: "#20e070",
  lightBlue: "#2f95dc",
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
  },
  dark: {
    text: palette.white,
    secondaryText: palette.gray,
    background: palette.lightBlack,
    cardBackground: palette.darkDarkGray,
    secondaryBackground: palette.darkDarkGray,
    tertiaryBackground: palette.darkGray,
    tint: palette.white,
    tabIconDefault: palette.lightLightGray,
    tabIconSelected: palette.white,
    border: palette.white,
    photoBackground: palette.gray,
  },
  status: {
    notInClass: palette.green,
    inClass: palette.red,
  },
  lightRed: palette.lightRed,
  red: palette.red,
  deepRed: palette.deepRed,
  green: palette.green,
  lightBlue: palette.lightBlue,
  black: palette.black,
  white: palette.white,
};
