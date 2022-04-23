import { Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { Icon, Text, View } from "./Themed";

import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { useNavigation } from "@react-navigation/core";
import useColorScheme from "../hooks/useColorScheme";
import { useState } from "react";

const days = ["M", "T", "W", "T", "F"];

export default function Calendar() {
  const navigation = useNavigation();

  const colorScheme = useColorScheme();

  const d = new Date();
  let today = d.getDay() - 1;
  const [selected, setSelected] = useState(today);

  return (
    <View style={[styles.row, { justifyContent: "space-between" }]}>
      {days.map((day, i) => (
        <Pressable
          style={[
            styles.day,
            { borderColor: Colors[colorScheme].text },
            selected === i ? styles.daySelected : null,
          ]}
          onPress={() => setSelected(i)}
          key={i}
        >
          <Text
            style={
              selected === i
                ? {color: Colors.light.background}
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
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  day: {
    alignItems: "center",
    justifyContent: "center",
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
    borderWidth: 1,
  },
  daySelected: {
    backgroundColor: Colors.status.notInClass,
  },
});
