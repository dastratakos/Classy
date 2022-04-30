import {
  Button,
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";
import { Icon, View } from "./Themed";

import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import useColorScheme from "../hooks/useColorScheme";

export default function SearchBar({
  placeholder,
  focused,
  searchPhrase,
  setSearchPhrase,
  setFocused,
}: {
  placeholder: string;
  focused: boolean;
  searchPhrase: string;
  setSearchPhrase: (arg0: string) => void;
  setFocused: (arg0: boolean) => void;
}) {
  const colorScheme = useColorScheme();

  return (
    <View style={AppStyles.row}>
      <View
        style={[
          styles.inputContainer,
          { backgroundColor: Colors[colorScheme].photoBackground },
        ]}
      >
        <Icon name="search" size={20} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={searchPhrase}
          onChangeText={setSearchPhrase}
          onFocus={() => {
            setFocused(true);
          }}
        />
        {focused && (
          <Pressable onPress={() => setSearchPhrase("")}>
            <Icon name="close" size={20} />
          </Pressable>
        )}
      </View>
      {focused && (
        <View>
          <Button
            title="Cancel"
            onPress={() => {
              Keyboard.dismiss();
              setFocused(false);
            }}
          ></Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    padding: 10,
    flexDirection: "row",
    borderRadius: 15,
    alignItems: "center",
    flex: 1,
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
});
