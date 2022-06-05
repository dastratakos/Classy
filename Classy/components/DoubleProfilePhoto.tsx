import ProfilePhoto from "./ProfilePhoto";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { FontAwesome, View } from "./Themed";

import Colors from "../constants/Colors";
import ProfilePhotoModal from "./ProfilePhotoModal";
import useColorScheme from "../hooks/useColorScheme";
import { useState } from "react";

export default function DoubleProfilePhoto({
  frontUrl,
  backUrl,
  size,
  style,
}: {
  frontUrl: string;
  backUrl: string;
  size: number;
  style?: Object;
  loading?: boolean;
  withModal?: boolean;
}) {
  const colorScheme = useColorScheme();

  const borderWidth = size / 20;

  return (
    <View
      style={[
        {
          height: size,
          width: size,
          overflow: "hidden",
        },
        style,
      ]}
    >
      <ProfilePhoto
        url={backUrl}
        size={size * 0.7}
        style={{ position: "absolute", right: 0, top: 0 }}
      />
      <ProfilePhoto
        url={frontUrl}
        size={size * 0.7 + borderWidth}
        style={{
          position: "absolute",
          left: -borderWidth,
          bottom: -borderWidth,
          borderWidth,
          borderColor: Colors[colorScheme].background,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
  },
});
