import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { Text, View } from "../components/Themed";
import { useContext, useState } from "react";

import AppContext from "../context/Context";
import Button from "../components/Buttons/Button";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { StatusBar } from "expo-status-bar";
import WideButton from "../components/Buttons/WideButton";
import { auth } from "../firebase";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function Settings() {
  const context = useContext(AppContext);

  const [name, setName] = useState(context.user.name);
  const [major, setMajor] = useState(context.user.major);
  const [gradYear, setGradYear] = useState(context.user.gradYear);
  const [interests, setInterests] = useState(context.user.interests);
  const [isPrivate, setIsPrivate] = useState(context.user.isPrivate);

  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "AuthStack" }],
        });
      })
      .catch((error) => alert(error.message));
  };

  const handleSavePress = () => {
    context.setUser({
      ...context.user,
      name,
      major,
      gradYear,
      interests,
      isPrivate,
    });

    navigation.goBack();
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].background },
      ]}
      contentContainerStyle={{ alignItems: "center" }}
    >
      {isPrivate ? (
        <WideButton
          text="Switch to Public Account"
          onPress={() => setIsPrivate(false)}
        />
      ) : (
        <WideButton
          text="Switch to Private Account"
          onPress={() => setIsPrivate(true)}
        />
      )}
      <View
        style={styles.separator}
        lightColor={Colors.light.imagePlaceholder}
        darkColor={Colors.dark.imagePlaceholder}
      />
      <WideButton
        text="Change Password"
        onPress={() => console.log("Change password pressed")}
      />
      <View style={{ height: Layout.spacing.medium }} />
      <WideButton text="Log Out" onPress={handleSignOut} />
      <View
        style={styles.separator}
        lightColor={Colors.light.imagePlaceholder}
        darkColor={Colors.dark.imagePlaceholder}
      />
      <View
        style={[styles.row, { width: "100%", justifyContent: "space-between" }]}
      >
        <View style={{ width: "48%" }}>
          <Button text="Cancel" onPress={() => navigation.goBack()} />
        </View>
        <View style={{ width: "48%" }}>
          <Button text="Save Changes" onPress={handleSavePress} />
        </View>
      </View>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Layout.spacing.medium,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  field: {
    width: "40%",
    paddingRight: Layout.spacing.large,
  },
  inputContainer: {
    width: "100%",
  },
  input: {
    paddingVertical: Layout.spacing.xsmall,
    width: "60%",
  },
  photo: {
    height: Layout.image.large,
    width: Layout.image.large,
    borderRadius: Layout.image.large / 2,
    marginBottom: Layout.spacing.medium,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: Layout.spacing.large,
    height: 2,
    borderRadius: 1,
    width: "80%",
  },
});
