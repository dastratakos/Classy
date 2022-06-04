import * as Haptics from "expo-haptics";

import {
  ImageBackground,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";
import { Text, View } from "../components/Themed";
import { auth, signInWithEmailAndPassword } from "../firebase";
import {
  getFriendIds,
  getNumFriendsInCourse,
  getRequestIds,
} from "../services/friends";
import { useContext, useEffect, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { LoginProps } from "../types";
import { getCurrentTermId } from "../utils";
import { getEnrollments } from "../services/enrollments";
import { getHistory } from "../services/history";
import { getUser } from "../services/users";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function Login({ route }: LoginProps) {
  const context = useContext(AppContext);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const [email, setEmail] = useState(route.params?.email || "");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [loading, setLoading] = useState<boolean>(true);
  const [loginButtonLoading, setLoginButtonLoading] = useState<boolean>(false);

  useEffect(() => {
    /* Check if user is signed in. */
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setUp(user.uid);
      else setLoading(false);
    });

    return unsubscribe;
  }, []);

  const connectStreamChatUser = async (
    id: string,
    name: string,
    photoUrl: string
  ) => {
    const streamChatUser = { id, name, image: photoUrl };

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

  const setUp = async (id: string) => {
    const user = await getUser(id);
    context.setUser(user);

    const [friendIds, requestIds, enrollments, history] = await Promise.all([
      getFriendIds(id),
      getRequestIds(id),
      getEnrollments(id),
      getHistory(id),
    ]);
    context.setFriendIds(friendIds);
    context.setRequestIds(requestIds);
    context.setHistory(history);

    /* Get numFriends only for current enrollments. */
    for (let i = 0; i < enrollments.length; i++) {
      const enrollment = enrollments[i];
      if (enrollment.termId !== getCurrentTermId()) continue;

      enrollments[i].numFriends = await getNumFriendsInCourse(
        enrollment.courseId,
        friendIds,
        enrollment.termId
      );
    }
    context.setEnrollments(enrollments);

    connectStreamChatUser(id, user.name, user.photoUrl);

    if (user.onboarded)
      navigation.reset({
        index: 0,
        routes: [{ name: "Root" }],
      });
    else navigation.navigate("Onboarding");

    setEmail("");
    setPassword("");
    setErrorMessage("");
    setLoginButtonLoading(false);
  };

  const signIn = () => {
    if (!email || !password) {
      setErrorMessage("Please enter an email and a password.");
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoginButtonLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((response) => {
        const user = response.user;
        console.log(`Logged in with: ${JSON.stringify(user, null, 2)}`);
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setLoginButtonLoading(false);
      });
  };

  if (loading)
    return (
      <ImageBackground
        source={require("../assets/images/splash.png")}
        style={{ height: Layout.window.height, width: Layout.window.width }}
        resizeMode="cover"
      />
    );

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
            onChangeText={(text) => setPassword(text)}
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
        </View>
        <View style={[AppStyles.row, { justifyContent: "flex-end" }]}>
          <Pressable onPress={() => navigation.navigate("ResetPassword")}>
            <Text style={styles.textButton}>Forgot password?</Text>
          </Pressable>
        </View>
        <View style={{ height: Layout.spacing.large }} />

        <Button
          text="Log In"
          onPress={signIn}
          loading={loginButtonLoading}
          emphasized
          wide
        />
      </KeyboardAvoidingView>
      <View
        style={[
          styles.registerContainer,
          { borderColor: Colors[colorScheme].border },
        ]}
      >
        <Text
          style={[
            styles.noAccount,
            { color: Colors[colorScheme].secondaryText },
          ]}
        >
          Don't have an account?
        </Text>
        <Pressable onPress={() => navigation.navigate("Register", { email })}>
          <Text style={styles.textButton}>Register.</Text>
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
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Layout.spacing.xlarge,
    borderTopWidth: 1,
  },
  noAccount: {
    marginRight: Layout.spacing.xsmall,
  },
  textButton: {
    fontWeight: "500",
  },
});
