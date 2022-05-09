import { ActivityIndicator, Image, StyleSheet } from "react-native";
import { Icon, View } from "./Themed";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

export default function ProfilePhoto({
  url,
  size,
  style,
  loading = false,
}: {
  url: string;
  size: number;
  style?: Object;
  loading?: boolean;
}) {
  const colorScheme = useColorScheme();

  if (loading || !url)
    return (
      <View
        style={[
          styles.placeholder,
          { height: size, width: size, borderRadius: size / 2 },
          { backgroundColor: Colors[colorScheme].photoBackground },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Icon
            name="user"
            size={size / 2}
            style={{ color: Colors[colorScheme].tertiaryBackground }}
          />
        )}
      </View>
    );

  return (
    <Image
      source={{ uri: url }}
      style={[{ height: size, width: size, borderRadius: size / 2 }, style]}
    />
  );
}

const styles = StyleSheet.create({
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
  },
});
