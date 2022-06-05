import * as Haptics from "expo-haptics";

import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";
import { Text, View } from "../components/Themed";
import { auth, createUserWithEmailAndPassword } from "../firebase";
import { useContext, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { RegisterProps } from "../types";
import { sendEmailVerification } from "firebase/auth";
import { setUser } from "../services/users";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import { Timestamp } from "firebase/firestore";

export default function Register({ route }: RegisterProps) {
  const [email, setEmail] = useState(route.params?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [registerLoading, setRegisterLoading] = useState<boolean>(false);

  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  const createUser = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setRegisterLoading(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then((response) => {
        if (auth.currentUser) sendEmailVerification(auth.currentUser);

        const uid = response.user.uid;

        connectStreamChatUser(uid);
        const data = {
          id: uid,
          email,
          degrees: [],
          interests: "",
          createdAt: Timestamp.now(),
          isPrivate: false,
        };
        setUser(data);

        context.setUser({
          ...context.user,
          ...data,
        });

        setRegisterLoading(true);

        navigation.navigate("Onboarding");
      })
      .catch((error) => {
        setRegisterLoading(true);
        setErrorMessage(error.message);
      });
  };

  const connectStreamChatUser = async (
    id: string,
    name?: string,
    photoUrl?: string
  ) => {
    const streamChatUser = { id };
    if (name) streamChatUser.name = name;
    if (photoUrl) streamChatUser.photoUrl = photoUrl;

    const user = await context.streamClient.connectUser(
      streamChatUser,
      context.streamClient.devToken(streamChatUser.id)
    );
    console.log("StreamChat user connected:", user);

    context.setTotalUnreadCount(user.me.total_unread_count);

    context.streamClient.on((event) => {
      if (event.total_unread_count !== undefined) {
        console.log("Total unread count:", event.total_unread_count);
        context.setTotalUnreadCount(user.me.total_unread_count);
      }

      if (event.unread_channels !== undefined) {
        console.log("Unread channels:", event.unread_channels);
      }
    });
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].background },
      ]}
    >
      <KeyboardAvoidingView style={styles.keyboardContainer} behavior="padding">
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Classy</Text>
        </View>
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

          <Button
            text="Register"
            onPress={createUser}
            loading={registerLoading}
            emphasized
            wide
          />
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
  titleContainer: {
    marginBottom: Layout.spacing.large,
  },
  title: {
    fontSize: Layout.text.xxlarge,
    fontWeight: "500",
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
