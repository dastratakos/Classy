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
  const [selected, setSelected] = useState(
    today >= 0 && today <= 4 ? today : 0
  );

  const times = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

  return (
    <>
      <View style={[AppStyles.row, { justifyContent: "space-between" }]}>
        {days.map((day, i) => (
          <Pressable
            style={{ flex: 1, alignItems: "center" }}
            onPress={() => setSelected(i)}
            key={i}
          >
            <View
              style={[
                styles.day,
                selected === i
                  ? today === i
                    ? { backgroundColor: Colors.status.notInClass }
                    : { backgroundColor: Colors[colorScheme].text }
                  : null,
              ]}
            >
              <Text
                style={
                  today === i
                    ? selected === i
                      ? { color: Colors.white, fontWeight: "500" }
                      : { color: Colors.red }
                    : selected === i
                    ? {
                        color: Colors[colorScheme].background,
                        fontWeight: "500",
                      }
                    : { color: Colors[colorScheme].text }
                }
              >
                {day}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
      <View
        style={[{ marginTop: Layout.spacing.medium, backgroundColor: "red" }]}
      >
        {times.map((time, i) => (
          <View
            style={[AppStyles.row, { height: Layout.spacing.xxlarge }]}
            key={i}
          >
            <Text
              style={{
                color: Colors[colorScheme].secondaryText,
                fontWeight: "600",
                width: 45,
                textAlign: "right",
                paddingRight: 10,
                fontSize: Layout.text.small,
              }}
            >
              {((time - 1) % 12) + 1} {time > 11 ? "PM" : "AM"}
            </Text>
            <View
              style={{
                // width: "80%",
                flex: 1,
                height: 1,
                borderRadius: 1,
                backgroundColor: Colors[colorScheme].secondaryText,
              }}
            />
          </View>
        ))}
      </View>
    </>
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
