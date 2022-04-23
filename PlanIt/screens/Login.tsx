import {
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";
import { Text, View } from "../components/Themed";
import { auth, signInWithEmailAndPassword } from "../firebase";
import { useEffect, useState } from "react";

import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import WideButton from "../components/Buttons/WideButton";
import { useNavigation } from "@react-navigation/core";
import useColorScheme from "../hooks/useColorScheme";
import AppStyles from "../styles/AppStyles";

export default function Login({ email_ }: { email_: string }) {
  const [email, setEmail] = useState(email_);
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigation = useNavigation();

  const colorScheme = useColorScheme();

  /* Check if user is signed in. */
  useEffect(() => {
    if (auth.currentUser) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Root" }],
      });
    } else {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
          navigation.reset({
            index: 0,
            routes: [{ name: "Root" }],
          });

          // TODO: firebase querying
          // const usersRef = firebase.firestore().collection("users");
          // firebase.auth().onAuthStateChanged((user) => {
          //   if (user) {
          //     usersRef
          //       .doc(user.uid)
          //       .get()
          //       .then((document) => {
          //         const userData = document.data();
          //         setLoading(false);
          //         setUser(userData);
          //       })
          //       .catch((error) => {
          //         setLoading(false);
          //       });
          //   } else {
          //     setLoading(false);
          //   }
          // });
        }
      });

      return unsubscribe;
    }
  }, []);

  const signIn = () => {
    if (!email || !password) {
      console.log("here");
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

        // TODO: firebase querying
        // const uid = response.user.uid;
        // const usersRef = firebase.firestore().collection("users");
        // usersRef
        //   .doc(uid)
        //   .get()
        //   .then((firestoreDocument) => {
        //     if (!firestoreDocument.exists) {
        //       alert("User does not exist anymore.");
        //       return;
        //     }
        //     const user = firestoreDocument.data();
        //     navigation.navigate("Home", { user });
        //   })
        //   .catch((error) => {
        //     alert(error);
        //   });
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
        <Pressable
          onPress={() => navigation.navigate("Register", { email })}
        >
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
