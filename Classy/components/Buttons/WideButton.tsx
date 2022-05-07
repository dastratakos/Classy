import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../Themed";

import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import useColorScheme from "../../hooks/useColorScheme";
import AppStyles from "../../styles/AppStyles";

export default function WideButton({
  text,
  onPress,
}: {
  text: string;
  onPress: () => void;
}) {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        style={styles.innerContainer}
      >
        <Text>{text}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...AppStyles.boxShadow,
    padding: Layout.spacing.small,
    width: "100%",
    borderRadius: Layout.radius.small,
    alignItems: "center",
    justifyContent: "center",
    height: Layout.buttonHeight.medium,
  },
  innerContainer: {
    alignItems: "center"
  }
});
