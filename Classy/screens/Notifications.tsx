import * as Haptics from "expo-haptics";

import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../components/Themed";
import { useContext } from "react";

import AppContext from "../context/Context";
import Colors, { enrollmentColors } from "../constants/Colors";
import Layout from "../constants/Layout";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import AppStyles from "../styles/AppStyles";

export default function Notifications() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  return (
    <View style={AppStyles.section}>
      <Text>Notifications screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
