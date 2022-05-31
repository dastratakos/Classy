import {
  Animated,
  Button as RNButton,
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";
import { Icon, Icon3, View } from "./Themed";

import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import useColorScheme from "../hooks/useColorScheme";
import { useRef } from "react";

export default function SimpleSearchBar({
  placeholder,
  focused,
  searchPhrase,
  onChangeText,
  setFocused,
}: {
  placeholder: string;
  focused: boolean;
  searchPhrase: string;
  onChangeText: (arg0: string) => void;
  setFocused: (arg0: boolean) => void;
}) {
  const colorScheme = useColorScheme();

  return (
    <View style={AppStyles.row}>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: Colors[colorScheme].photoBackground,
            // width,
          },
        ]}
      >
        <Icon name="search" size={Layout.icon.small} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={searchPhrase}
          onChangeText={(text) => {
            onChangeText(text);
          }}
          onFocus={() => setFocused(true)}
        />
        {focused && searchPhrase !== "" && (
          <Pressable
            style={{ paddingVertical: 8 }}
            onPress={() => onChangeText("")}
          >
            <Icon3 name="close" size={Layout.icon.small} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    paddingHorizontal: 10,
    flexDirection: "row",
    borderRadius: 15,
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: 10,
  },
});
