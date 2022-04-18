import { Platform, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";

import Layout from "../constants/Layout";
import { StatusBar } from "expo-status-bar";
import WideButton from "../components/Buttons/WideButton";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/core";

export default function ModalScreen() {
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
    <View style={styles.container}>
      {/* <Text style={styles.title}>Modal</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/ModalScreen.tsx" /> */}
      <Text>Email: {auth.currentUser?.email}</Text>
      <WideButton text="Log out" onPress={handleSignOut} />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Layout.spacing.medium,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
