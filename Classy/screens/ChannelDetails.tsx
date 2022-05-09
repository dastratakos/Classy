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
import { useContext, useEffect, useRef, useState } from "react";

import ActionSheet from "react-native-actionsheet";
import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import { Channel as ChannelType } from "stream-chat";
import Colors from "../constants/Colors";
import FriendCard from "../components/FriendCard";
import Layout from "../constants/Layout";
import ProfilePhoto from "../components/ProfilePhoto";
import { SaveFormat } from "expo-image-manipulator";
import Separator from "../components/Separator";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";

export default function ChannelDetails() {
  const context = useContext(AppContext);
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const [members, setMembers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveDisabled, setSaveDisabled] = useState(true);

  const [photoUrl, setPhotoUrl] = useState("");
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const actionSheetRef = useRef();

  const actionSheetOptions = [
    "Remove current photo",
    "Choose from library",
    "Take photo",
    "Cancel",
  ];

  useEffect(() => {
    const getState = async () => {
      const state = await context.channel.watch();
      setGroupName(state.channel.name);
      setPhotoUrl(state.channel.photoUrl);
      const filteredMembers = state.members.filter(
        (member) => member.user.id !== context.user.id
      );
      console.log("photoUrl:", state.channel.photoUrl);
      if (filteredMembers.length > 1) {
        /* Get two users and display both images. */
        const photo0: string = filteredMembers[0].user.image;
        const photo1: string = filteredMembers[1].user.image;
        setPhotoUrls([photo0, photo1]);
      }
      if (!state.channel.photoUrl && filteredMembers.length === 1) {
        setPhotoUrl(filteredMembers[0].user.image);
      }
      setMembers(filteredMembers);
    };

    getState();
  }, []);

  const RenderPhoto = () => {
    if (uploading)
      return (
        <ProfilePhoto
          url=""
          size={Layout.photo.xlarge}
          style={{ marginBottom: Layout.spacing.medium }}
          loading
        />
      );

    if (photoUrl)
      return (
        <ProfilePhoto
          url={photoUrl}
          size={Layout.photo.xlarge}
          style={{ marginBottom: Layout.spacing.medium }}
        />
      );
    else if (photoUrls.length !== 2)
      return (
        <ProfilePhoto
          url=""
          size={Layout.photo.xlarge}
          style={{ marginBottom: Layout.spacing.medium }}
        />
      );

    return (
      <View
        style={[
          AppStyles.row,
          { justifyContent: "center", marginBottom: Layout.spacing.medium },
        ]}
      >
        <View
          style={{
            height: Layout.photo.xlarge,
            width: Layout.photo.xlarge,
          }}
        >
          <ProfilePhoto
            url={photoUrls[0]}
            size={Layout.photo.xlarge * 0.7}
            style={{ position: "absolute", right: 0, top: 0 }}
          />
          <ProfilePhoto
            url={photoUrls[1]}
            size={Layout.photo.xlarge * 0.7 + 2}
            style={{
              position: "absolute",
              left: -2,
              bottom: -2,
              borderWidth: 2,
              borderColor: Colors[colorScheme].background,
            }}
          />
        </View>
      </View>
    );
  };

  const handleSavePress = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSaveLoading(true);

    await context.channel.updatePartial({ set: { name: groupName } });

    setSaveLoading(false);
    setSaveDisabled(true);
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

        await context.channel.updatePartial({ set: { photoUrl: uploadUrl } });
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
      context.channel.updatePartial({ set: { photoUrl: "" } });
    } else if (action === "Choose from library") {
      choosePhoto();
    } else if (action === "Take photo") {
      takePhoto();
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: Colors[colorScheme].background }}
      contentContainerStyle={{ alignItems: "center", justifyContent: "center" }}
    >
      <View style={[AppStyles.section, { alignItems: "center" }]}>
        {members.length > 1 ? (
          <>
            <RenderPhoto />
            <Button
              text="Change profile photo"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                actionSheetRef.current?.show();
              }}
            />
            <Separator />
            <KeyboardAvoidingView
              style={styles.inputContainer}
              behavior="padding"
            >
              <View
                style={[AppStyles.row, { marginBottom: Layout.spacing.large }]}
              >
                <View style={styles.field}>
                  <Text>Group name</Text>
                </View>
                <TextInput
                  placeholder="Name"
                  value={groupName}
                  onChangeText={(text) => {
                    setGroupName(text);
                    setSaveDisabled(false);
                  }}
                  style={[styles.input, { color: Colors[colorScheme].text }]}
                  autoCapitalize="words"
                  textContentType="name"
                />
              </View>
              <View style={AppStyles.row}>
                <View style={{ width: "48%" }}>
                  <Button text="Cancel" onPress={() => navigation.goBack()} />
                </View>
                <View style={{ width: "48%" }}>
                  <Button
                    text="Save Name"
                    onPress={handleSavePress}
                    loading={saveLoading}
                    disabled={saveDisabled}
                    emphasized
                  />
                </View>
              </View>
            </KeyboardAvoidingView>
            <Separator />
          </>
        ) : null}
        <Text style={styles.title}>Members</Text>
        {/* TODO: use FlatList */}
        {members.map((member) => {
          return (
            <FriendCard
              friend={{ ...member.user, photoUrl: member.user.image }}
              key={member.user.id}
            />
          );
        })}
        {members.length > 1 ? (
          <>
            <Separator />
            <Text>TODO: Leave chat</Text>
          </>
        ) : null}
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
  title: {
    fontSize: Layout.text.large,
    fontWeight: "500",
    marginTop: Layout.spacing.small,
    marginBottom: Layout.spacing.medium,
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
