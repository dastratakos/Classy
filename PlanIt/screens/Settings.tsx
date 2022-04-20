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
import { useContext, useState } from "react";
import AppContext from "../context/Context";
import useColorScheme from "../hooks/useColorScheme";

export default function Settings() {
  const context = useContext(AppContext);

  const [name, setName] = useState(context.userName);
  const [major, setMajor] = useState(context.userMajor);
  const [gradYear, setGradYear] = useState(context.userGradYear);
  const [interests, setInterests] = useState(context.userInterests);
  const [private_, setPrivate] = useState(context.userPrivate);

  const navigation = useNavigation();

  const colorScheme = useColorScheme();

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

  const handleSavePress = () => {
    context.setUserName(name);
    context.setUserMajor(major);
    context.setUserGradYear(gradYear);
    context.setUserInterests(interests);
    context.setUserPrivate(private_);

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
            style={[styles.input, { color: Colors[colorScheme].text }]}
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
            style={[styles.input, { color: Colors[colorScheme].text }]}
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
            style={[styles.input, { color: Colors[colorScheme].text }]}
          />
        </View>
        <View style={styles.row}>
          <View style={styles.field}>
            <Text>Clubs & Interests</Text>
          </View>
          <TextInput
            placeholder="Clubs & Interests"
            value={interests}
            onChangeText={(text) => setInterests(text)}
            style={[styles.input, { color: Colors[colorScheme].text }]}
          />
        </View>
        <View style={styles.row}>
          <View style={styles.field}>
            <Text>Email</Text>
          </View>
          <Text style={{ color: Colors[colorScheme].secondaryText }}>
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
          onPress={() => setPrivate(false)}
        />
      ) : (
        <WideButton
          text="Switch to Private Account"
          onPress={() => setPrivate(true)}
        />
      )}
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <WideButton
        text="Change Password"
        onPress={() => console.log("Change password pressed")}
      />
      <View style={{ height: Layout.spacing.medium }} />
      <WideButton text="Log Out" onPress={handleSignOut} />
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
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
