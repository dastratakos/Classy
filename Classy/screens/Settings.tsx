import * as Haptics from "expo-haptics";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import { Text, View } from "../components/Themed";
import { useContext, useRef, useState } from "react";

import ActionSheet from "react-native-actionsheet";
import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import ProfilePhoto from "../components/ProfilePhoto";
import { SaveFormat } from "expo-image-manipulator";
import Separator from "../components/Separator";
import { User } from "../types";
import { auth } from "../firebase";
import { generateSubstrings } from "../utils";
import { updateUser } from "../services/users";
import { uploadImage } from "../services/storage";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function Settings() {
  const context = useContext(AppContext);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const [photoUrl, setPhotoUrl] = useState(context.user.photoUrl || "");
  const [name, setName] = useState(context.user.name || "");
  const [major, setMajor] = useState(context.user.major || "");
  const [gradYear, setGradYear] = useState(context.user.gradYear || "");
  const [interests, setInterests] = useState(context.user.interests || "");

  const [saveDisabled, setSaveDisabled] = useState(true);

  const [uploading, setUploading] = useState(false);

  const actionSheetRef = useRef();

  const actionSheetOptions = [
    "Remove current photo",
    "Choose from library",
    "Take photo",
    "Cancel",
  ];

  const handleSavePress = () => {
    const newUser: User = {
      ...context.user,
      name,
      major,
      gradYear,
      interests,
      photoUrl,
      keywords: generateSubstrings(name),
    };

    context.setUser(newUser);
    updateUser(context.user.id, newUser);
    context.streamClient.updateUser({
      id: context.user.id,
      name,
      image: photoUrl,
    });

    navigation.goBack();
  };

  const handleImagePicked = async (
    pickerResult: ImagePicker.ImagePickerResult
  ) => {
    console.log(pickerResult);

    try {
      setUploading(true);

      if (!pickerResult.cancelled) {
        const compressedImage = await ImageManipulator.manipulateAsync(
          pickerResult.uri,
          [{ resize: { width: 200, height: 200 } }],
          { format: SaveFormat.JPEG }
        );

        console.log("compressed image:", compressedImage);

        const uploadUrl = await uploadImage(
          `${context.user.id}/profilePhoto.jpg`,
          compressedImage.uri
        );
        setPhotoUrl(uploadUrl);

        const newUser = {
          ...context.user,
          photoUrl,
        };
        context.setUser(newUser);

        updateUser(context.user.id, newUser);

        context.streamClient.updateUser({
          id: context.user.id,
          name,
          image: photoUrl,
        });
      }
    } catch (error) {
      console.log(error);
      alert("Failed to upload photo. Please try again");
    } finally {
      setUploading(false);
    }
  };

  const choosePhoto = async () => {
    // No permissions request is necessary for launching the image library
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0,
      // base64: true,
    });

    handleImagePicked(pickerResult);
  };

  const takePhoto = async () => {
    if (Platform.OS !== "web") {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("Please turn on camera permissions to take a photo.");
        return;
      }
    }

    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    handleImagePicked(pickerResult);
  };

  const handleActionSheetOptionPressed = (index: number) => {
    const action = actionSheetOptions[index];
    if (action === "Remove current photo") {
      setPhotoUrl("");
      setSaveDisabled(false);
    } else if (action === "Choose from library") {
      choosePhoto();
    } else if (action === "Take photo") {
      takePhoto();
    }
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].background },
      ]}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <ProfilePhoto
        url={photoUrl}
        size={Layout.photo.xlarge}
        style={{ marginBottom: Layout.spacing.medium }}
        loading={uploading}
      />
      <Button
        text="Change profile photo"
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          actionSheetRef.current?.show();
        }}
      />
      <Separator />
      <KeyboardAvoidingView style={styles.inputContainer} behavior="padding">
        <View style={AppStyles.row}>
          <View style={styles.field}>
            <Text>Name</Text>
          </View>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setSaveDisabled(false);
            }}
            style={[styles.input, { color: Colors[colorScheme].text }]}
            autoCapitalize="words"
            textContentType="name"
          />
        </View>
        <View style={AppStyles.row}>
          <View style={styles.field}>
            <Text>Major</Text>
          </View>
          <TextInput
            placeholder="Major"
            value={major}
            onChangeText={(text) => {
              setMajor(text);
              setSaveDisabled(false);
            }}
            style={[styles.input, { color: Colors[colorScheme].text }]}
            autoCapitalize="words"
          />
        </View>
        <View style={AppStyles.row}>
          <View style={styles.field}>
            <Text>Graduation Year</Text>
          </View>
          <TextInput
            placeholder="Graduation Year"
            value={gradYear}
            onChangeText={(text) => {
              setGradYear(text);
              setSaveDisabled(false);
            }}
            style={[styles.input, { color: Colors[colorScheme].text }]}
            autoCapitalize="words"
          />
        </View>
        <View style={AppStyles.row}>
          <View style={styles.field}>
            <Text>Clubs & Interests</Text>
          </View>
          <TextInput
            placeholder="Clubs & Interests"
            value={interests}
            onChangeText={(text) => {
              setInterests(text);
              setSaveDisabled(false);
            }}
            style={[styles.input, { color: Colors[colorScheme].text }]}
            autoCapitalize="sentences"
          />
        </View>
        <View style={AppStyles.row}>
          <View style={styles.field}>
            <Text>Email</Text>
          </View>
          <Text
            style={[styles.input, { color: Colors[colorScheme].secondaryText }]}
          >
            {auth.currentUser?.email}
          </Text>
        </View>
      </KeyboardAvoidingView>
      <Separator />
      <Button
        text="Manage Account"
        onPress={() => navigation.navigate("ManageAccount")}
        wide
      />
      <Separator />
      <View style={AppStyles.row}>
        <View style={{ width: "48%" }}>
          <Button text="Cancel" onPress={() => navigation.goBack()} />
        </View>
        <View style={{ width: "48%" }}>
          <Button
            text="Save Changes"
            onPress={handleSavePress}
            disabled={saveDisabled}
            emphasized
          />
        </View>
      </View>

      <ActionSheet
        ref={actionSheetRef}
        options={actionSheetOptions}
        cancelButtonIndex={actionSheetOptions.length - 1}
        destructiveButtonIndex={0}
        onPress={handleActionSheetOptionPressed}
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
  field: {
    width: "40%",
    paddingRight: Layout.spacing.large,
  },
  input: {
    paddingVertical: Layout.spacing.xsmall,
    width: "60%",
  },
});
