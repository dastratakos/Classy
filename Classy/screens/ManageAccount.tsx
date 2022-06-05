import * as Haptics from "expo-haptics";

import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { auth } from "../firebase";
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
import { deleteUserCompletely, updateUser } from "../services/users";
import { History, User } from "../types";

export default function Settings() {
  const context = useContext(AppContext);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const handleChangeIsPrivate = (isPrivate: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    context.setUser({
      ...context.user,
      isPrivate: isPrivate,
    });

    updateUser(context.user.id, { isPrivate });
  };

  const handleSignOut = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    signOut(auth)
      .then(() => {
        context.setUser({} as User);
        context.setFriendIds([]);
        context.setRequestIds([]);
        context.setEnrollments([]);
        context.setHistory({} as History);
        context.setFavorites([]);

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

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

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

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // TODO: need to figure out how to handle messages

    signInWithEmailAndPassword(
      auth,
      auth.currentUser?.email || "",
      currentPassword
    )
      .then((response) => {
        const user = response.user;

        deleteUserCompletely(user.uid);
        deleteUser(user);

        signOut(auth)
          .then(() => {
            context.setUser({} as User);
            context.setFriendIds([]);
            context.setRequestIds([]);
            context.setEnrollments([]);
            context.setHistory({} as History);
            context.setFavorites([]);

            context.streamClient.disconnect();

            navigation.reset({
              index: 0,
              routes: [{ name: "AuthStack" }],
            });
          })
          .catch((error) => setErrorMessage(error.message));
      })
      .catch((error) => setErrorMessage(error.message));
  };

  const deleteAccountAlert = () => {
    Alert.alert(
      "Delete account",
      "Are you sure? This action is irreversible.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: handleDeleteUserAndData,
        },
      ]
    );
  };

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
          emphasized
          wide
        />
      ) : (
        <Button
          text="Switch to Private Account"
          onPress={() => handleChangeIsPrivate(true)}
          emphasized
          wide
        />
      )}
      <Separator
        overrideStyles={{
          marginTop: Layout.spacing.large,
        }}
      />
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
      <Separator
        overrideStyles={{
          marginTop: Layout.spacing.large,
          marginBottom: Layout.spacing.large,
        }}
      />
      <Button
        text="Delete Account"
        onPress={deleteAccountAlert}
        wide
        textStyle={{ color: Colors.pink }}
      />
      <Separator
        overrideStyles={{
          marginTop: Layout.spacing.large,
          marginBottom: Layout.spacing.large,
        }}
      />
      <Button
        text="Log Out"
        onPress={handleSignOut}
        wide
        containerStyle={{ backgroundColor: Colors.pink }}
      />
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
