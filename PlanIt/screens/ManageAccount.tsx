import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { auth, db } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { deleteUser, signOut, updatePassword } from "firebase/auth";
import { useContext, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import Separator from "../components/Separator";
import { StatusBar } from "expo-status-bar";
import { Text } from "../components/Themed";
import WideButton from "../components/Buttons/WideButton";
import { signInWithEmailAndPassword } from "../firebase";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function Settings() {
  const context = useContext(AppContext);

  const [isPrivate, setIsPrivate] = useState(context.user.isPrivate);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        context.setUser({
          ...context.user,
          id: "",
          email: "",
          name: "",
          major: "",
          gradYear: "",
          interests: "",
          isPrivate: false,
          photoUrl: "",
        });

        navigation.reset({
          index: 0,
          routes: [{ name: "AuthStack" }],
        });
      })
      .catch((error) => setErrorMessage(error.message));
  };

  const handleUpdatePassword = () => {
    if (newPassword !== confirmNewPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }

    signInWithEmailAndPassword(
      auth,
      auth.currentUser?.email || "",
      currentPassword
    )
      .then((response) => {
        const user = response.user;
        updatePassword(user, newPassword)
          .then(() => {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
            setErrorMessage("");
          })
          .catch((error) => setErrorMessage(error.message));
      })
      .catch((error) => setErrorMessage(error.message));
  };

  const handleDeleteUserAndData = () => {
    if (!currentPassword) {
      setErrorMessage("Please enter current password to delete your account.");
      return;
    }

    signInWithEmailAndPassword(
      auth,
      auth.currentUser?.email || "",
      currentPassword
    )
      .then((response) => {
        const user = response.user;

        /* Get all UserCourses and delete. */
        const batch1 = writeBatch(db);
        const q1 = query(
          collection(db, "userCourses"),
          where("userId", "==", user.uid)
        );
        getDocs(q1)
          .then((querySnapshot1) => {
            querySnapshot1.forEach((doc) => {
              batch1.delete(doc.ref);
            });
            batch1.commit();

            /* Get all Friends (relationships) and delete. */
            const batch2 = writeBatch(db);
            const q2 = query(
              collection(db, "friends"),
              where(`ids.${user.uid}`, "==", true)
            );
            getDocs(q2).then((querySnapshot2) => {
              querySnapshot2.forEach((doc) => {
                batch2.delete(doc.ref);
              });
              batch2.commit();

              /* Get the user document and delete it. */
              deleteDoc(doc(db, "users", user.uid));

              /* Delete the user from Firebase auth. */
              deleteUser(user)
                .then(() => {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "Root" }],
                  });
                })
                .catch((error) => setErrorMessage(error.message));
            });
          })
          .catch((error) => setErrorMessage(error.message));
      })
      .catch((error) => setErrorMessage(error.message));
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].background },
      ]}
      contentContainerStyle={{ alignItems: "center" }}
    >
      {isPrivate ? (
        <WideButton
          text="Switch to Public Account"
          onPress={() => setIsPrivate(false)}
        />
      ) : (
        <WideButton
          text="Switch to Private Account"
          onPress={() => setIsPrivate(true)}
        />
      )}
      <Separator />
      <KeyboardAvoidingView style={styles.inputContainer}>
        {errorMessage ? (
          <Text style={AppStyles.errorText}>{errorMessage}</Text>
        ) : null}
        <TextInput
          placeholder="Current password"
          value={currentPassword}
          onChangeText={(text) => {
            setErrorMessage("");
            setCurrentPassword(text);
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
          placeholder="New password"
          value={newPassword}
          onChangeText={(text) => {
            setErrorMessage("");
            setNewPassword(text);
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
          textContentType="newPassword"
          secureTextEntry
        />
        <TextInput
          placeholder="Confirm new password"
          value={confirmNewPassword}
          onChangeText={(text) => {
            setErrorMessage("");
            setConfirmNewPassword(text);
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
          textContentType="newPassword"
          secureTextEntry
        />
      </KeyboardAvoidingView>
      <WideButton text="Change Password" onPress={handleUpdatePassword} />
      <Separator />
      <WideButton text="Delete Account" onPress={handleDeleteUserAndData} />
      <Separator />
      <WideButton text="Log Out" onPress={handleSignOut} />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Layout.spacing.medium,
  },
  inputContainer: {
    width: "100%",
  },
  input: {
    paddingHorizontal: Layout.spacing.medium,
    paddingVertical: Layout.spacing.small,
    borderRadius: Layout.spacing.small,
    // marginVertical: Layout.spacing.medium,
    marginVertical: Layout.spacing.small,
  },
});
