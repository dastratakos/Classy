import { KeyboardAvoidingView, StyleSheet, TextInput } from "react-native";
import { Text, View } from "../components/Themed";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "../firebase";
import { useEffect, useState } from "react";

import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import WideButton from "../components/Buttons/WideButton";
import { useNavigation } from "@react-navigation/core";
import useColorScheme from "../hooks/useColorScheme";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigation();

  const colorScheme = useColorScheme();

  useEffect(() => {
    // TODO: show a loading/splash screen before we determine user
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Root" }],
        });
      }
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

    return unsubscribe;
  }, []);

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((response) => {
        const user = response.user;
        console.log(`Registered with: ${user.email}`);

        // TODO: add the user to the database
        // const uid = response.user.uid;
        // const data = {
        //   id: uid,
        //   email,
        //   fullName,
        // };
        // const usersRef = firebase.firestore().collection("users");
        // usersRef
        //   .doc(uid)
        //   .set(data)
        //   .then(() => {
        //     navigation.navigate("Home", { user: data });
        //   })
        //   .catch((error) => {
        //     alert(error);
        //   });
      })
      .catch((error) => alert(error.message));
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((response) => {
        const user = response.user;
        console.log(`Logged in with: ${user.email}`);

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
      .catch((error) => alert(error.message));
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].background },
      ]}
      behavior="padding"
    >
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
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <WideButton text="Log In" onPress={handleLogin} />
        <View style={{ height: Layout.spacing.medium }} />
        <WideButton text="Register" onPress={handleSignUp} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Layout.spacing.medium,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    paddingHorizontal: Layout.spacing.medium,
    paddingVertical: Layout.spacing.small,
    borderRadius: Layout.spacing.small,
    marginTop: 40,
  },
  buttonContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
});
