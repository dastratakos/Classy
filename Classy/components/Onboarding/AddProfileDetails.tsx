import * as Haptics from "expo-haptics";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";

import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
} from "react-native";
import { Text, View } from "../Themed";
import { storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useContext, useRef, useState } from "react";

import ActionSheet from "react-native-actionsheet";
import AppContext from "../../context/Context";
import AppStyles from "../../styles/AppStyles";
import Button from "../Buttons/Button";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import ProfilePhoto from "../ProfilePhoto";
import { SaveFormat } from "expo-image-manipulator";
import useColorScheme from "../../hooks/useColorScheme";

export default function AddProfileDetails({
  photoUrl,
  setPhotoUrl,
  name,
  setName,
  major,
  setMajor,
  startYear,
  setStartYear,
  endYear,
  setEndYear,
  errorMessage,
  setErrorMessage,
}: {
  photoUrl: string;
  setPhotoUrl: (arg0: string) => void;
  name: string;
  setName: (arg0: string) => void;
  major: string;
  setMajor: (arg0: string) => void;
  startYear: number;
  setStartYear: (arg0: number) => void;
  endYear: number;
  setEndYear: (arg0: number) => void;
  errorMessage: string;
  setErrorMessage: (arg0: string) => void;
}) {
  const context = useContext(AppContext);
  const colorScheme = useColorScheme();

  const [uploading, setUploading] = useState(false);

  const actionSheetRef = useRef();

  const actionSheetOptions = [
    "Remove current photo",
    "Choose from library",
    "Take photo",
    "Cancel",
  ];

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

        const uploadUrl = await uploadImageAsync(compressedImage.uri);
        setPhotoUrl(uploadUrl);

        context.setUser({
          ...context.user,
          photoUrl,
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
    } else if (action === "Choose from library") {
      choosePhoto();
    } else if (action === "Take photo") {
      takePhoto();
    }
  };

  return (
    <View style={[AppStyles.section, styles.screenContainer]}>
      <Text style={styles.title}>Add Profile Details</Text>
      <ProfilePhoto
        url={photoUrl}
        size={Layout.photo.xlarge}
        style={{ marginBottom: Layout.spacing.medium }}
        loading={uploading}
      />
      <Button
        text="Choose profile photo"
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          actionSheetRef.current?.show();
        }}
      />
      <KeyboardAvoidingView style={styles.keyboardContainer} behavior="padding">
        <Text style={AppStyles.errorText}>{errorMessage}</Text>
        <View style={styles.inputContainer}>
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
            autoCorrect={false}
          />
          <TextInput
            placeholder="Major"
            value={major}
            onChangeText={(text) => {
              setErrorMessage("");
              setMajor(text);
            }}
            style={[
              styles.input,
              {
                backgroundColor: Colors[colorScheme].secondaryBackground,
                color: Colors[colorScheme].text,
              },
            ]}
            autoCapitalize="words"
            autoCorrect={false}
          />
          <TextInput
            placeholder="Start Year"
            value={`${startYear}`}
            onChangeText={(text) => {
              setErrorMessage("");
              setStartYear(parseInt(text));
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
            keyboardType="number-pad"
          />
          <TextInput
            placeholder="End Year"
            value={`${endYear}`}
            onChangeText={(text) => {
              setErrorMessage("");
              setEndYear(parseInt(text));
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
            keyboardType="number-pad"
          />
          <View style={{ height: Layout.spacing.large }} />
        </View>
      </KeyboardAvoidingView>

      <ActionSheet
        ref={actionSheetRef}
        options={actionSheetOptions}
        cancelButtonIndex={actionSheetOptions.length - 1}
        destructiveButtonIndex={0}
        onPress={handleActionSheetOptionPressed}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    width: Layout.window.width,
    alignItems: "center",
  },
  title: {
    fontSize: Layout.text.xxlarge,
    fontWeight: "500",
    marginBottom: Layout.spacing.large,
  },
  keyboardContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
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
});
