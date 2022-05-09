import {
  KeyboardAvoidingView,
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
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { deleteUser, signOut, updatePassword } from "firebase/auth";
import { useContext, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import Separator from "../components/Separator";
import { Text } from "../components/Themed";
import { signInWithEmailAndPassword } from "../firebase";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function Settings() {
  const context = useContext(AppContext);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const handleChangeIsPrivate = (isPrivate: boolean) => {
    context.setUser({
      ...context.user,
      isPrivate: isPrivate,
    });

    setUserDB(context.user.id);
  };

  const setUserDB = async (id: string) => {
    const userRef = doc(db, "users", id);
    await updateDoc(userRef, {
      isPrivate: context.user.isPrivate,
    });
  };

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

        context.streamClient.disconnect();

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

    // TODO: need to figure out how to handle messages

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

  // TODO: include notifications setting

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].background },
      ]}
      contentContainerStyle={{ alignItems: "center" }}
    >
      {context.user.isPrivate ? (
        <Button
          text="Switch to Public Account"
          onPress={() => handleChangeIsPrivate(false)}
          wide
        />
      ) : (
        <Button
          text="Switch to Private Account"
          onPress={() => handleChangeIsPrivate(true)}
          wide
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
      <Button text="Change Password" onPress={handleUpdatePassword} wide />
      <Separator />
      <Button text="Delete Account" onPress={handleDeleteUserAndData} wide />
      <Separator />
      <Button text="Log Out" onPress={handleSignOut} wide />
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
    marginVertical: Layout.spacing.small,
  },
});
