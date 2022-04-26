import { StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import useColorScheme from "../hooks/useColorScheme";

export default StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "stretch",
  },
  section: {
    width: "100%",
    padding: Layout.spacing.medium,
  },
  photoSmall: {
    height: Layout.image.small,
    width: Layout.image.small,
    borderRadius: Layout.image.small / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  photoMedium: {
    height: Layout.image.medium,
    width: Layout.image.medium,
    borderRadius: Layout.image.medium / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  photoLarge: {
    height: Layout.image.large,
    width: Layout.image.large,
    borderRadius: Layout.image.large / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  photoXlarge: {
    height: Layout.image.xlarge,
    width: Layout.image.xlarge,
    borderRadius: Layout.image.xlarge / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  separator: {
    marginVertical: Layout.spacing.large,
    height: 2,
    borderRadius: 1,
    width: "80%",
  },
  errorText: {
    alignSelf: "center",
    color: Colors.status.notInClass,
  },
  activityIndicatorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
