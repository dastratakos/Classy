import { StyleSheet, TouchableOpacity } from "react-native";

import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { Text, View } from "./Themed";

export default function CourseCard() {
  return (
    <TouchableOpacity
      onPress={() => console.log("Course pressed")}
      style={styles.container}
    >
      <View style={styles.textContainer}>
        <Text>CS 194W</Text>
        <Text>Senior Project (WIM)</Text>
        <Text>3 units</Text>
      </View>
      <View>
        <Text>9 friends</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Layout.radius.medium,
  },
  textContainer: {
    borderRadius: Layout.radius.medium,
  },
});
