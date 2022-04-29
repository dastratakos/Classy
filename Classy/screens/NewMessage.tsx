import { ScrollView, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { useContext } from "react";
import { useNavigation } from "@react-navigation/core";

export default function NewMessage() {
  const context = useContext(AppContext);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  return (
    <ScrollView
      style={{ backgroundColor: Colors[colorScheme].background }}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={AppStyles.section}>
        <Text>TODO: TextInput New Group Name (if 2 or more selected)</Text>
        <Text>TODO: Search bar</Text>
        <Text>TODO: list of search results, possibly recommended friends</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
