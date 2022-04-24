import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";
import { Text, View } from "../components/Themed";
import { auth, db, signInWithEmailAndPassword } from "../firebase";
import { useContext, useEffect, useState } from "react";

import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import WideButton from "../components/Buttons/WideButton";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import {
  onSnapshot,
  collection,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import AppContext from "../context/Context";
import { LoginProps } from "../types";

export default function Login({ route }: LoginProps) {
  const [email, setEmail] = useState(route.params?.email || "");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const context = useContext(AppContext);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  /* Check if user is signed in. */
  useEffect(() => {
    if (auth.currentUser) {
      getUser(auth.currentUser.uid);
      getFriendIds(auth.currentUser.uid);
      navigation.reset({
        index: 0,
        routes: [{ name: "Root" }],
      });
    } else {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          getUser(user.uid);
          getFriendIds(user.uid);
          navigation.reset({
            index: 0,
            routes: [{ name: "Root" }],
          });
        }
      });

      return unsubscribe;
    }
  }, []);

  const getUser = async (id: string) => {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      context.setUser({ ...context.user, ...docSnap.data() });
    } else {
      console.log(`Could not find user: ${id}`);
    }
  };

  const getFriendIds = async (id: string) => {
    const q = query(
      collection(db, "friends"),
      where(`ids.${id}`, "==", true),
      where("status", "==", "friends")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const friendIds = [] as string[];
      querySnapshot.forEach((doc) => {
        for (let key in doc.data().ids) {
          if (key !== id) {
            friendIds.push(key);
            return;
          }
        }
      });
      context.setFriendIds(friendIds);
    });
  };

  const signIn = () => {
    if (!email || !password) {
      setErrorMessage("Please enter an email and a password.");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((response) => {
        const user = response.user;
        console.log(`Logged in with: ${JSON.stringify(user, null, 2)}`);

        setEmail("");
        setPassword("");
        setErrorMessage("");
      })
      .catch((error) => setErrorMessage(error.message));
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
          <Text style={styles.title}>Plan-It</Text>
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
            secureTextEntry
          />
        </View>
        <View style={[AppStyles.row, { justifyContent: "flex-end" }]}>
          <Pressable onPress={() => navigation.navigate("ResetPassword")}>
            <Text style={styles.textButton}>Forgot password?</Text>
          </Pressable>
        </View>
        <View style={{ height: Layout.spacing.large }} />

        <WideButton text="Log In" onPress={signIn} />
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
