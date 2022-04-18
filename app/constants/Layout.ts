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
    small: 5,
    medium: 15,
    large: 25,
  },
  image: {
    small: 50,
    medium: 75,
    large: 100,
  },
  spacing: {
    small: 10,
    medium: 15,
    large: 20,
  },
};
