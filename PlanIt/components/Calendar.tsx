import { Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { Icon, Text, View } from "./Themed";

import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { useNavigation } from "@react-navigation/core";
import useColorScheme from "../hooks/useColorScheme";
import { useState } from "react";
import AppStyles from "../styles/AppStyles";

const days = ["M", "T", "W", "T", "F"];

export default function Calendar() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const d = new Date();
  const today = d.getDay() - 1;
  
  // default to selecting Monday if today is a weekend
  const [selected, setSelected] = useState(today >= 0 && today <= 4 ? today: 0);

  return (
    <View style={[AppStyles.row, { justifyContent: "space-between" }]}>
      {days.map((day, i) => (
        <Pressable
          style={[
            styles.day,
            selected === i
              ? today === i
                ? { backgroundColor: Colors.status.notInClass }
                : { backgroundColor: Colors[colorScheme].text }
              : null,
          ]}
          onPress={() => setSelected(i)}
          key={i}
        >
          <Text
            style={
              today === i
                ? selected === i
                  ? { color: Colors.white, fontWeight: "500" }
                  : { color: Colors.red }
                : selected === i
                ? { color: Colors[colorScheme].background, fontWeight: "500" }
                : { color: Colors[colorScheme].text }
            }
          >
            {day}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  day: {
    alignItems: "center",
    justifyContent: "center",
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
  },
});
