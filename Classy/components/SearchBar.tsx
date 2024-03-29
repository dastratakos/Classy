import {
  Animated,
  Button as RNButton,
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";
import { FontAwesome, Ionicons, View } from "./Themed";

import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import useColorScheme from "../hooks/useColorScheme";
import { useRef } from "react";

export default function SearchBar({
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

  const searchBarWidth = Layout.window.width - 2 * Layout.spacing.medium;
  const buttonWidth = 72; // hard-coded width of "Cancel" button

  const width = useRef(new Animated.Value(searchBarWidth)).current;

  return (
    <View style={AppStyles.row}>
      <Animated.View
        style={[
          styles.inputContainer,
          {
            backgroundColor: Colors[colorScheme].searchBarBackground,
            width,
          },
        ]}
      >
        <FontAwesome name="search" size={Layout.icon.small} />
        <TextInput
          style={[styles.input, { color: Colors[colorScheme].text }]}
          placeholder={placeholder}
          value={searchPhrase}
          onChangeText={(text) => {
            onChangeText(text);
          }}
          onFocus={() => {
            setFocused(true);
            Animated.timing(width, {
              toValue: searchBarWidth - buttonWidth,
              duration: 200,
              useNativeDriver: false,
            }).start();
          }}
        />
        {focused && searchPhrase !== "" && (
          <Pressable
            style={{ paddingVertical: 8 }}
            onPress={() => onChangeText("")}
          >
            <Ionicons name="close" size={Layout.icon.small} />
          </Pressable>
        )}
      </Animated.View>
      <Animated.View
        style={{
          opacity: width.interpolate({
            inputRange: [searchBarWidth - buttonWidth, searchBarWidth],
            outputRange: [1, 0],
          }),
        }}
      >
        <RNButton
          title="Cancel"
          color={Colors.lightBlue}
          onPress={() => {
            Keyboard.dismiss();
            onChangeText("");
            setFocused(false);
            Animated.timing(width, {
              toValue: searchBarWidth,
              duration: 200,
              useNativeDriver: false,
            }).start();
          }}
        />
      </Animated.View>
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
