import * as Haptics from "expo-haptics";

import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { View } from "../components/Themed";
import { useContext } from "react";

import AppContext from "../context/Context";
import Colors, { enrollmentColors } from "../constants/Colors";
import Layout from "../constants/Layout";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function SelectColor() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  return (
    <ScrollView
      style={{ backgroundColor: Colors[colorScheme].background }}
      contentContainerStyle={{
        marginBottom: Layout.spacing.xlarge,
        alignItems: "center",
      }}
    >
      <View style={styles.container}>
        {enrollmentColors.map((color, i) => (
          <View style={styles.colorContainer} key={i}>
            <TouchableOpacity
              style={[styles.color, { backgroundColor: color }]}
              key={i}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                context.setSelectedColor(color);
                navigation.goBack();
              }}
            >
              {color === context.selectedColor && (
                <View style={styles.colorBorder}>
                  <View
                    style={[styles.innerColor, { backgroundColor: color }]}
                  />
                </View>
              )}
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Layout.spacing.medium,
    marginLeft: Layout.spacing.medium,
    marginRight: Layout.spacing.medium,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  colorContainer: {
    width: "15%",
    paddingVertical: Layout.spacing.medium,
    alignItems: "center",
  },
  color: {
    height: Layout.buttonHeight.medium,
    width: Layout.buttonHeight.medium,
    borderRadius: Layout.radius.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  colorBorder: {
    height: Layout.buttonHeight.medium - 4,
    width: Layout.buttonHeight.medium - 4,
    borderRadius: Layout.radius.medium - 2,
    justifyContent: "center",
    alignItems: "center",
  },
  innerColor: {
    height: Layout.buttonHeight.medium - 8,
    width: Layout.buttonHeight.medium - 8,
    borderRadius: Layout.radius.medium - 4,
  },
});
