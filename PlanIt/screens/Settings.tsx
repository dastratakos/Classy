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
import { auth, db } from "../firebase";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import { doc, updateDoc } from "firebase/firestore";
import Separator from "../components/Separator";

export default function Settings() {
  const context = useContext(AppContext);

  const [name, setName] = useState(context.user.name);
  const [major, setMajor] = useState(context.user.major);
  const [gradYear, setGradYear] = useState(context.user.gradYear);
  const [interests, setInterests] = useState(context.user.interests);

  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const handleSavePress = () => {
    context.setUser({
      ...context.user,
      name,
      major,
      gradYear,
      interests,
    });

    setUser(context.user.id);

    navigation.goBack();
  };

  const setUser = async (id: string) => {
    const userRef = doc(db, "users", id);
    await updateDoc(userRef, {
      name,
      major,
      gradYear,
      interests,
    });
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].background },
      ]}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View
        style={[
          styles.photo,
          { backgroundColor: Colors[colorScheme].imagePlaceholder },
        ]}
      ></View>
      <Button
        text="Edit profile photo"
        onPress={() => console.log("Edit profile photo pressed")}
      />
      <Separator />
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
            autoCapitalize="words"
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
            autoCapitalize="words"
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
            autoCapitalize="words"
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
            autoCapitalize="sentences"
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
      <Separator />
      <WideButton
        text="Manage Account"
        onPress={() => navigation.navigate("ManageAccount")}
      />
      <Separator />
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
});
