import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";
import { Text, View } from "../components/Themed";
import { Timestamp, doc, setDoc } from "firebase/firestore";
import { auth, createUserWithEmailAndPassword, db } from "../firebase";

import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { RegisterProps } from "../types";
import { StreamChat } from "stream-chat";
import WideButton from "../components/Buttons/WideButton";
import { sendEmailVerification } from "firebase/auth";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import { useState } from "react";

const STREAM_API_KEY = "y9tk9hsvsxqa";
const client = StreamChat.getInstance(STREAM_API_KEY);

export default function Register({ route }: RegisterProps) {
  const [email, setEmail] = useState(route.params?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const createUser = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((response) => {
        if (auth.currentUser) sendEmailVerification(auth.currentUser);

        const uid = response.user.uid;
        const data = {
          id: uid,
          email,
          createdAt: Timestamp.now(),
          isPrivate: false,
        };
        connectStreamChatUser(uid);
        setDoc(doc(db, "users", uid), data)
          .then(() => {
            // TODO: navigate to onboarding
            navigation.reset({
              index: 0,
              routes: [{ name: "Root" }],
            });
          })
          .catch((error) => {
            setErrorMessage(error);
          });
      })
      .catch((error) => setErrorMessage(error.message));
  };

  const connectStreamChatUser = async (
    id: string,
    name?: string,
    photoUrl?: string
  ) => {
    const streamChatUser = { id };
    if (name) streamChatUser.name = name;
    if (photoUrl) streamChatUser.photoUrl = photoUrl;

    await client.connectUser(
      streamChatUser,
      client.devToken(streamChatUser.id)
    );
    console.log("User connected:");
    console.log(streamChatUser);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].background },
      ]}
    >
      <KeyboardAvoidingView style={styles.keyboardContainer} behavior="padding">
        <Text style={AppStyles.errorText}>{errorMessage}</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={[
              styles.input,
              {
                backgroundColor: Colors[colorScheme].secondaryBackground,
                color: Colors[colorScheme].text,
              },
            ]}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={(text) => {
              setErrorMessage("");
              setPassword(text);
            }}
            style={[
              styles.input,
              {
                backgroundColor: Colors[colorScheme].secondaryBackground,
                color: Colors[colorScheme].text,
              },
            ]}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
            secureTextEntry
          />
          <TextInput
            placeholder="Confirm password"
            value={confirmPassword}
            onChangeText={(text) => {
              setErrorMessage("");
              setConfirmPassword(text);
            }}
            style={[
              styles.input,
              {
                backgroundColor: Colors[colorScheme].secondaryBackground,
                color: Colors[colorScheme].text,
              },
            ]}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
            secureTextEntry
          />
          <View style={{ height: Layout.spacing.large }} />

          <WideButton text="Register" onPress={createUser} />
        </View>
      </KeyboardAvoidingView>
      <View
        style={[
          styles.loginContainer,
          { borderColor: Colors[colorScheme].border },
        ]}
      >
        <Text
          style={[
            styles.haveAccount,
            { color: Colors[colorScheme].secondaryText },
          ]}
        >
          Already have an account?
        </Text>
        <Pressable onPress={() => navigation.navigate("Login", { email })}>
          <Text style={styles.login}>Login.</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Layout.spacing.medium,
  },
  keyboardContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    width: "100%",
  },
  input: {
    paddingHorizontal: Layout.spacing.medium,
    paddingVertical: Layout.spacing.small,
    borderRadius: Layout.spacing.small,
    marginVertical: Layout.spacing.medium,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Layout.spacing.xlarge,
    borderTopWidth: 1,
  },
  haveAccount: {
    marginRight: Layout.spacing.xsmall,
  },
  login: {
    fontWeight: "500",
  },
});
