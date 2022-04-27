import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  TextInput,
} from "react-native";
import { Text, View } from "../components/Themed";
import { auth, db, storage } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useContext, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import Separator from "../components/Separator";
import { StatusBar } from "expo-status-bar";
import WideButton from "../components/Buttons/WideButton";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import { SaveFormat } from "expo-image-manipulator";

export default function Settings() {
  const context = useContext(AppContext);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const [photoUrl, setPhotoUrl] = useState(context.user.photoUrl || "");
  const [name, setName] = useState(context.user.name || "");
  const [major, setMajor] = useState(context.user.major || "");
  const [gradYear, setGradYear] = useState(context.user.gradYear || "");
  const [interests, setInterests] = useState(context.user.interests || "");

  const [uploading, setUploading] = useState(false);

  const handleSavePress = () => {
    context.setUser({
      ...context.user,
      name,
      major,
      gradYear,
      interests,
    });

    setUserDB(context.user.id);

    navigation.goBack();
  };

  const setUserDB = async (id: string) => {
    const userRef = doc(db, "users", id);
    await updateDoc(userRef, {
      name,
      major,
      gradYear,
      interests,
      photoUrl,
    });
  };

  /**
   * Image functions from
   * https://github.com/expo/examples/blob/master/with-firebase-storage-upload/App.js
   */
  const uploadImageAsync = async (uri: string) => {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob: Blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const fileRef = ref(storage, `${context.user.id}/profilePhoto.jpg`);
    const result = await uploadBytes(fileRef, blob)
      .then(() => console.log("Successfully uploaded bytes"))
      .catch((error) => console.log(error.message));

    // We're done with the blob, close and release it
    blob.close();

    return await getDownloadURL(fileRef);
  };

  const handleImagePicked = async (
    pickerResult: ImagePicker.ImagePickerResult
  ) => {
    try {
      setUploading(true);

      if (!pickerResult.cancelled) {
        const compressedImage = await ImageManipulator.manipulateAsync(
          pickerResult.uri,
          [{ resize: { width: 200, height: 200 } }],
          { format: SaveFormat.JPEG }
        );

        console.log("compressed image:", compressedImage);

        const uploadUrl = await uploadImageAsync(compressedImage.uri);
        setPhotoUrl(uploadUrl);

        context.setUser({
          ...context.user,
          photoUrl,
        });

        setUserDB(context.user.id);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to upload photo");
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

    console.log(pickerResult);

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

    console.log(pickerResult);

    handleImagePicked(pickerResult);
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].background },
      ]}
      contentContainerStyle={{ alignItems: "center" }}
    >
      {uploading ? (
        <View
          style={[
            AppStyles.photoXlarge,
            {
              marginBottom: Layout.spacing.medium,
              backgroundColor: Colors[colorScheme].imagePlaceholder,
            },
          ]}
        >
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <>
          {photoUrl ? (
            <Pressable
              onLongPress={() =>
                Share.share({
                  message: photoUrl,
                  title: "Check out this photo",
                  url: photoUrl,
                })
              }
            >
              <Image
                source={{ uri: photoUrl }}
                style={[
                  AppStyles.photoXlarge,
                  {
                    marginBottom: Layout.spacing.medium,
                    backgroundColor: Colors[colorScheme].imagePlaceholder,
                  },
                ]}
              />
            </Pressable>
          ) : (
            <View
              style={[
                AppStyles.photoXlarge,
                {
                  marginBottom: Layout.spacing.medium,
                  backgroundColor: Colors[colorScheme].imagePlaceholder,
                },
              ]}
            />
          )}
        </>
      )}
      <View style={AppStyles.row}>
        <View style={{ width: "48%" }}>
          <Button text="Choose profile photo" onPress={choosePhoto} />
        </View>
        <View style={{ width: "48%" }}>
          <Button text="Take profile photo" onPress={takePhoto} />
        </View>
      </View>
      <Separator />
      <KeyboardAvoidingView style={styles.inputContainer} behavior="padding">
        <View style={AppStyles.row}>
          <View style={styles.field}>
            <Text>Name</Text>
          </View>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={(text) => setName(text)}
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
            onChangeText={(text) => setMajor(text)}
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
            onChangeText={(text) => setGradYear(text)}
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
            onChangeText={(text) => setInterests(text)}
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
      <WideButton
        text="Manage Account"
        onPress={() => navigation.navigate("ManageAccount")}
      />
      <Separator />
      <View style={AppStyles.row}>
        <View style={{ width: "48%" }}>
          <Button text="Cancel" onPress={() => navigation.goBack()} />
        </View>
        <View style={{ width: "48%" }}>
          <Button text="Save Changes" onPress={handleSavePress} />
        </View>
      </View>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Layout.spacing.medium,
  },
  field: {
    width: "40%",
    paddingRight: Layout.spacing.large,
  },
  inputContainer: {
    width: "100%",
  },
  input: {
    paddingVertical: Layout.spacing.xsmall,
    width: "60%",
  },
});
