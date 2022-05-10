import * as Haptics from "expo-haptics";

import { Animated, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "./Themed";

import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import useColorScheme from "../hooks/useColorScheme";
import { useState } from "react";
import { Tab } from "../types";

export default function TabView({
  tabs,
  selectedStyle,
  addTabMargin = false,
}: {
  tabs: Tab[];
  selectedStyle?: Object;
  addTabMargin?: boolean;
}) {
  const colorScheme = useColorScheme();

  const [selectedId, setSelectedId] = useState(0);
  const [tabWidth, setTabWidth] = useState(0);
  const [translateValue] = useState(new Animated.Value(Layout.spacing.xsmall));

  const Indicator = () => {
    return (
      <Animated.View
        style={[
          {
            position: "absolute",
            backgroundColor: Colors[colorScheme].tertiaryBackground,
            height: Layout.spacing.xxlarge,
            borderRadius: Layout.spacing.xlarge,
            width: tabWidth,

            transform: [{ translateX: translateValue }],
          },
          selectedStyle,
        ]}
      />
    );
  };

  const selectTab = (i: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedId(i);
    Animated.spring(translateValue, {
      toValue: i * tabWidth + Layout.spacing.xsmall,
      velocity: 10,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: Colors[colorScheme].cardBackground,
            marginHorizontal: addTabMargin ? Layout.spacing.medium : 0,
          },
        ]}
        onLayout={(event) =>
          setTabWidth(
            (event.nativeEvent.layout.width - 2 * Layout.spacing.xsmall) /
              tabs.length
          )
        }
      >
        <Indicator />
        {tabs.map((tab, i) => (
          <TouchableOpacity
            onPress={() => selectTab(i)}
            key={i}
            style={styles.tabContainer}
          >
            <Text style={styles.tabLabel}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {tabs[selectedId].component}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...AppStyles.row,
    ...AppStyles.boxShadow,
    padding: Layout.spacing.xxsmall,
    borderRadius: Layout.spacing.xlarge,
    marginBottom: Layout.spacing.large,
  },
  tabContainer: {
    flexGrow: 1,
    alignItems: "center",
    borderRadius: Layout.spacing.xlarge,
    padding: Layout.spacing.small,
    height: Layout.spacing.xxlarge,
  },
  tabLabel: {
    fontSize: Layout.text.large,
  },
});
