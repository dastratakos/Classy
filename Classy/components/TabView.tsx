import { Animated, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "./Themed";

import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import useColorScheme from "../hooks/useColorScheme";
import { useState } from "react";

export default function TabView({ tabs }) {
  const colorScheme = useColorScheme();

  const [selectedId, setSelectedId] = useState(0);
  const [tabWidth, setTabWidth] = useState(0);
  const [translateValue] = useState(new Animated.Value(Layout.spacing.xsmall));

  const Indicator = () => {
    return (
      <Animated.View
        style={{
          position: "absolute",
          backgroundColor: Colors.red,
          height: Layout.spacing.xxlarge,
          borderRadius: Layout.spacing.xlarge,
          width: tabWidth,

          transform: [{ translateX: translateValue }],
        }}
      />
    );
  };

  const selectTab = (i: number) => {
    setSelectedId(i);
    Animated.spring(translateValue, {
      toValue: i * tabWidth + Layout.spacing.xsmall,
      velocity: 10,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      <View
        style={[
          AppStyles.row,
          styles.container,
          AppStyles.boxShadow,
          { backgroundColor: Colors[colorScheme].cardBackground },
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
      {/* {tabs[selectedId].component} */}
      {tabs.map((tab, i) => (
        <>{selectedId == i && tabs[selectedId].component}</>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: Colors.lightRed,
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
