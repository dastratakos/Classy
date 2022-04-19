import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { Text, View } from "../components/Themed";

import Button from "../components/Buttons/Button";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { StatusBar } from "expo-status-bar";
import WideButton from "../components/Buttons/WideButton";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/core";
import { useState } from "react";

const profile = {
  name: "Dean Stratakos",
  major: "Computer Science",
  gradYear: "2022 (Senior)",
  private: true,
};

export default function ModalScreen() {
  const [name, setName] = useState(profile.name);
  const [major, setMajor] = useState(profile.major);
  const [gradYear, setGradYear] = useState(profile.gradYear);
  const [private_, setPrivate] = useState(profile.private);

  const navigation = useNavigation();

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      })
      .catch((error) => alert(error.message));
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={styles.photo}></View>
      <Button
        text="Edit profile photo"
        onPress={() => console.log("Edit profile photo pressed")}
      />
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <KeyboardAvoidingView style={styles.inputContainer} behavior="padding">
        <View style={styles.row}>
          <View style={styles.field}>
            <Text>Name</Text>
          </View>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={(text) => setName(text)}
            style={styles.input}
          />
        </View>
        <View style={styles.row}>
          <View style={styles.field}>
            <Text>Major</Text>
          </View>
          <TextInput
            placeholder="Major"
            value={major}
            onChangeText={(text) => setMajor(text)}
            style={styles.input}
          />
        </View>
        <View style={styles.row}>
          <View style={styles.field}>
            <Text>Graduation Year</Text>
          </View>
          <TextInput
            placeholder="Graduation Year"
            value={gradYear}
            onChangeText={(text) => setGradYear(text)}
            style={styles.input}
          />
        </View>
        <View style={styles.row}>
          <View style={styles.field}>
            <Text>Email</Text>
          </View>
          <Text style={{ color: Colors.light.secondaryText }}>
            {auth.currentUser?.email}
          </Text>
        </View>
      </KeyboardAvoidingView>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {private_ ? (
        <WideButton
          text="Switch to Public Account"
          onPress={() => console.log("Switch to Public Account pressed")}
        />
      ) : (
        <WideButton
          text="Switch to Private Account"
          onPress={() => console.log("Switch to Private Account pressed")}
        />
      )}
      <View style={{ height: Layout.spacing.medium }} />
      <View
        style={[styles.row, { width: "100%", justifyContent: "space-between" }]}
      >
        <View style={{ width: "48%" }}>
          <Button
            text="Cancel"
            onPress={() => console.log("Change password pressed")}
          />
        </View>
        <View style={{ width: "48%" }}>
          <Button
            text="Save Changes"
            onPress={() => console.log("Change password pressed")}
          />
        </View>
      </View>
      <View style={{ height: Layout.spacing.medium }} />
      <WideButton
        text="Change Password"
        onPress={() => console.log("Change password pressed")}
      />
      <View style={{ height: Layout.spacing.medium }} />
      <WideButton text="Log Out" onPress={handleSignOut} />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Layout.spacing.medium,
    backgroundColor: Colors.light.background,
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
    backgroundColor: Colors.imagePlaceholder,
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
