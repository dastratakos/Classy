import { Dimensions } from "react-native";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

export default {
  header: {
    // fontFamily: "Raleway",
    fontSize: 36,
    fontWeight: "500",
  },
  subheader: {
    fontSize: 24,
  },
  body: {
    // fontFamily: "Merriweather",
    fontSize: 16,
  },
};
