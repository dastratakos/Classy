import Colors from "../constants/Colors";
import { Animated, StyleSheet } from "react-native";
import { Text, View } from "./Themed";
import Layout from "../constants/Layout";
import useColorScheme from "../hooks/useColorScheme";

export default function Paginator({ data, scrollX }) {
  const colorScheme = useColorScheme();
  const width = Layout.window.width;

  return (
    <View style={styles.container}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: "clamp",
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            style={[
              styles.dot,
              {
                backgroundColor: Colors[colorScheme].tint,
                width: dotWidth,
                opacity,
              },
            ]}
            key={i}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: Layout.spacing.xxxlarge,
  },
  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: Layout.spacing.small,
  },
});
