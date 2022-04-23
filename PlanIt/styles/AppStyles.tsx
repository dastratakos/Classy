import { StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import useColorScheme from "../hooks/useColorScheme";

export default StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
  },
  section: {
    width: "100%",
    padding: Layout.spacing.medium,
  },
  separator: {
    marginVertical: Layout.spacing.large,
    height: 2,
    borderRadius: 1,
    width: "80%",
  },
  errorText: {
    color: Colors.status.notInClass,
  },
  activityIndicatorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
