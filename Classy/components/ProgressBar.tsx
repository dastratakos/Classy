import { Pressable, StyleSheet } from "react-native";
import { Text, View } from "./Themed";

import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import MaskedView from "@react-native-masked-view/masked-view";
import useColorScheme from "../hooks/useColorScheme";

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

  if (!onPress)
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: Colors[colorScheme].cardBackground },
          containerStyle,
        ]}
      >
        <MaskedView
          style={styles.maskedView}
          maskElement={<View style={styles.maskElement} />}
        >
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: Colors.yellow,
                width: `${progress}%`,
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
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: Colors.yellow,
                width: `${progress}%`,
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
