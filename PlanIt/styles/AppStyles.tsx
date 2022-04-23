import { StyleSheet } from "react-native";
import Colors from "../constants/Colors";

export default StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },
  errorText: {
    color: Colors.status.notInClass,
  },
});
