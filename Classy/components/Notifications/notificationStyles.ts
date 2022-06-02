import AppStyles from "../../styles/AppStyles";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    ...AppStyles.row,
    padding: Layout.spacing.large,
    borderBottomWidth: 1,
  },
  textContainer: {
    marginLeft: Layout.spacing.medium,
    flex: 1,
  },
  notificationText: {
    fontSize: Layout.text.medium,
    paddingLeft: Layout.spacing.xsmall,
    paddingRight: Layout.spacing.medium,
  },
  pressableText: {
    fontWeight: "600",
  },
  time: {
    fontSize: Layout.text.medium,
  },
  squareImage: {
    height: Layout.photo.xsmall,
    width: Layout.photo.xsmall,
  },
  indicator: {
    height: 10,
    width: 10,
    borderRadius: 10 / 2,
    backgroundColor: Colors.pink,
    marginRight: Layout.spacing.xsmall,
  },
});
