import {
  Pressable,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
} from "react-native";
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
import Button from "../components/Buttons/Button";
import { useNavigation } from "@react-navigation/core";
import useColorScheme from "../hooks/useColorScheme";

export default function Register({
  email_,
  password_,
}: {
  email_: string;
  password_: string;
}) {
  const [email, setEmail] = useState(email_);
  const [password, setPassword] = useState(password_);
  const [name, setName] = useState("");
  const [gradYear, setGradYear] = useState("");

  const navigation = useNavigation();

  const colorScheme = useColorScheme();

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

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].background },
      ]}
    >
      <KeyboardAvoidingView style={styles.keyboardContainer} behavior="padding">
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
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={(text) => setName(text)}
            style={[
              styles.input,
              {
                backgroundColor: Colors[colorScheme].secondaryBackground,
                color: Colors[colorScheme].text,
              },
            ]}
            autoCapitalize="words"
          />
          {/* TODO: choose from scrolling menu */}
          <TextInput
            placeholder="Graduation Year"
            value={gradYear}
            onChangeText={(text) => setGradYear(text)}
            style={[
              styles.input,
              {
                backgroundColor: Colors[colorScheme].secondaryBackground,
                color: Colors[colorScheme].text,
              },
            ]}
            autoCapitalize="words"
          />
        </View>
        <View style={{ height: Layout.spacing.large }} />

        <WideButton text="Register" onPress={handleSignUp} />
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
        <Pressable
          onPress={() => navigation.navigate("Login", { email, password })}
        >
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
  photo: {
    alignSelf: "center",
    height: Layout.image.large,
    width: Layout.image.large,
    borderRadius: Layout.image.large / 2,
    marginBottom: Layout.spacing.medium,
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
