import { Dimensions } from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  radius: {
    xsmall: 5,
    small: 8,
    medium: 15,
    large: 25,
  },
  photo: {
    xxsmall: 30,
    xsmall: 40,
    small: 50,
    medium: 75,
    large: 100,
    xlarge: 150,
  },
  icon: {
    small: 20,
    medium: 25,
    large: 30,
  },
  spacing: {
    xxsmall: 3,
    xsmall: 5,
    small: 10,
    medium: 15,
    large: 20,
    xlarge: 30,
    xxlarge: 40,
    xxxlarge: 50,
  },
  text: {
    small: 10,
    medium: 14,
    large: 18,
    xlarge: 22,
    xxlarge: 26,
  },
  buttonHeight: {
    medium: 40,
    large: 70,
  },
};
