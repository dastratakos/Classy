import { Animated, Pressable, StyleSheet } from "react-native";
import { Text, View } from "./Themed";

import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import MaskedView from "@react-native-masked-view/masked-view";
import useColorScheme from "../hooks/useColorScheme";
import { useEffect, useRef, useState } from "react";

export default function ProgressBar({
  progress,
  text,
  onPress,
  containerStyle,
}: {
  progress: number;
  text: string;
  onPress?: () => void;
  containerStyle?: Object;
}) {
  const colorScheme = useColorScheme();

  const width = useRef(new Animated.Value(0)).current;

  if (!onPress)
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: Colors[colorScheme].cardBackground },
          containerStyle,
        ]}
        onLayout={(event) => {
          const totalWidth = event.nativeEvent.layout.width;
          console.log("transition to width:", (totalWidth * progress) / 100);
          Animated.timing(width, {
            toValue: (totalWidth * progress) / 100,
            duration: 500,
            useNativeDriver: false,
          }).start();
        }}
      >
        <MaskedView
          style={styles.maskedView}
          maskElement={<View style={styles.maskElement} />}
        >
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: Colors.yellow,
                width,
              },
            ]}
          />
          <Text style={styles.text}>{text}</Text>
        </MaskedView>
      </View>
    );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].cardBackground },
        containerStyle,
      ]}
      onLayout={(event) => {
        const totalWidth = event.nativeEvent.layout.width;
        console.log("transition to width:", (totalWidth * progress) / 100);
        Animated.timing(width, {
          toValue: (totalWidth * progress) / 100,
          duration: 500,
          useNativeDriver: false,
        }).start();
      }}
    >
      <MaskedView
        style={styles.maskedView}
        maskElement={<View style={styles.maskElement} />}
      >
        <Pressable
          style={({ pressed }) => [
            { opacity: pressed ? 0.5 : 1 },
            styles.pressable,
          ]}
          onPress={onPress}
        >
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: Colors.yellow,
                width,
              },
            ]}
          />
          <Text style={styles.text}>{text}</Text>
        </Pressable>
      </MaskedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...AppStyles.boxShadow,
    borderRadius: Layout.radius.medium,
    height: Layout.buttonHeight.medium,
  },
  maskedView: {
    flex: 1,
    justifyContent: "center",
  },
  maskElement: {
    flex: 1,
    borderRadius: Layout.radius.medium,
  },
  pressable: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    alignSelf: "center",
  },
});
