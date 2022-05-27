import { StyleSheet } from "react-native";
import Layout from "../../constants/Layout";

export default StyleSheet.create({
  gridTimeText: {
    fontWeight: "600",
    textAlign: "right",
    paddingRight: 10,
    fontSize: Layout.text.small,
    backgroundColor: "transparent",
  },
  gridLine: {
    flex: 1,
    height: 1,
    borderRadius: 1,
  },
});
