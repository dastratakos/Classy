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
import { Text, View } from "../Themed";
import React, { useCallback, useContext, useRef, useState } from "react";

import ActionSheet from "react-native-actionsheet";
import AppContext from "../../context/Context";
import AppStyles from "../../styles/AppStyles";
import Button from "../Buttons/Button";
import Colors from "../../constants/Colors";
import Layout from "../../constants/Layout";
import ProfilePhoto from "../ProfilePhoto";
import { SaveFormat } from "expo-image-manipulator";
import useColorScheme from "../../hooks/useColorScheme";
import { uploadImage } from "../../services/storage";
import Separator from "../Separator";
import DropDownPicker from "react-native-dropdown-picker";
import { majorList } from "../../utils/majorList";
import { yearList } from "../../utils/yearList";

export default function AddProfileDetails({
  photoUrl,
  setPhotoUrl,
  name,
  setName,
  major,
  setMajor,
  startYear,
  setStartYear,
  gradYear,
  setGradYear,
  errorMessage,
  setErrorMessage,
}: {
  photoUrl: string;
  setPhotoUrl: (arg0: string) => void;
  name: string;
  setName: (arg0: string) => void;
  major: string;
  setMajor: (arg0: string) => void;
  startYear: string;
  setStartYear: (arg0: string) => void;
  gradYear: string;
  setGradYear: (arg0: string) => void;
  errorMessage: string;
  setErrorMessage: (arg0: string) => void;
}) {
  const context = useContext(AppContext);
  const colorScheme = useColorScheme();

  const [majorOpen, setMajorOpen] = useState(false);
  const [majorItems, setMajorItems] = useState(majorList);
  const onMajorOpen = useCallback(() => {
    setStartYearOpen(false);
    setGradYearOpen(false);
  }, []);
  // DropDownPicker.setMode("BADGE"); // TODO: for multiple select

  const [startYearOpen, setStartYearOpen] = useState(false);
  const [startYearItems, setStartYearItems] = useState(yearList);
  const onStartYearOpen = useCallback(() => {
    setMajorOpen(false);
    setGradYearOpen(false);
  }, []);

  const [gradYearOpen, setGradYearOpen] = useState(false);
  const [gradYearItems, setGradYearItems] = useState(yearList);
  const onGradYearOpen = useCallback(() => {
    setMajorOpen(false);
    setStartYearOpen(false);
  }, []);

  const [uploading, setUploading] = useState(false);

  const actionSheetRef = useRef();

  const actionSheetOptions = [
    "Remove current photo",
    "Choose from library",
    "Take photo",
    "Cancel",
  ];

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
    <View style={[styles.container]}>
      <Text style={styles.title}>Add Profile Details</Text>
      <ScrollView
        style={styles.screenContainer}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          contentContainerStyle={{ alignItems: "center" }}
          behavior="position"
        >
          <ProfilePhoto
            url={photoUrl}
            size={Layout.photo.large}
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
          <View style={{ height: Layout.spacing.large }} />
          <Separator />
          <Text style={AppStyles.errorText}>{errorMessage}</Text>
          <View style={styles.inputContainer}>
            <View style={styles.item}>
              <View style={styles.field}>
                <Text>Name</Text>
              </View>
              <TextInput
                placeholder="Name"
                value={name}
                onChangeText={setName}
                style={[styles.input, { color: Colors[colorScheme].text }]}
                autoCapitalize="words"
                textContentType="name"
              />
            </View>
            <View style={styles.item}>
              <View style={styles.field}>
                <Text>Major</Text>
              </View>
              <DropDownPicker
                open={majorOpen}
                onOpen={onMajorOpen}
                value={major}
                items={majorItems}
                setOpen={setMajorOpen}
                setValue={setMajor}
                setItems={setMajorItems}
                // multiple
                // min={0}
                // max={2}
                placeholder="Major"
                placeholderStyle={{ color: Colors[colorScheme].secondaryText }}
                searchable
                searchPlaceholder="Search..."
                showBadgeDot={false}
                dropDownDirection="TOP"
                modalProps={{
                  animationType: "slide",
                }}
                theme={colorScheme === "light" ? "LIGHT" : "DARK"}
                addCustomItem
                style={{ backgroundColor: Colors[colorScheme].background }}
              />
            </View>
            <View style={AppStyles.row}>
              <View style={[styles.item, { width: "48%" }]}>
                <View style={styles.field}>
                  <Text>Start Year</Text>
                </View>
                <DropDownPicker
                  open={startYearOpen}
                  onOpen={onStartYearOpen}
                  value={startYear}
                  items={startYearItems}
                  setOpen={setStartYearOpen}
                  setValue={setStartYear}
                  setItems={setStartYearItems}
                  // multiple
                  // min={0}
                  // max={2}
                  placeholder="Start Year"
                  placeholderStyle={{
                    color: Colors[colorScheme].secondaryText,
                  }}
                  searchable
                  searchPlaceholder="Search..."
                  showBadgeDot={false}
                  dropDownDirection="TOP"
                  modalProps={{
                    animationType: "slide",
                  }}
                  theme={colorScheme === "light" ? "LIGHT" : "DARK"}
                  style={{ backgroundColor: Colors[colorScheme].background }}
                />
              </View>
              <View style={[styles.item, { width: "48%" }]}>
                <View style={styles.field}>
                  <Text>Graduation Year</Text>
                </View>
                <DropDownPicker
                  open={gradYearOpen}
                  onOpen={onGradYearOpen}
                  value={gradYear}
                  items={gradYearItems}
                  setOpen={setGradYearOpen}
                  setValue={setGradYear}
                  setItems={setGradYearItems}
                  // multiple
                  // min={0}
                  // max={2}
                  placeholder="Graduation Year"
                  placeholderStyle={{
                    color: Colors[colorScheme].secondaryText,
                  }}
                  searchable
                  searchPlaceholder="Search..."
                  showBadgeDot={false}
                  dropDownDirection="TOP"
                  modalProps={{
                    animationType: "slide",
                  }}
                  theme={colorScheme === "light" ? "LIGHT" : "DARK"}
                  style={{ backgroundColor: Colors[colorScheme].background }}
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>

        <ActionSheet
          ref={actionSheetRef}
          options={actionSheetOptions}
          cancelButtonIndex={actionSheetOptions.length - 1}
          destructiveButtonIndex={0}
          onPress={handleActionSheetOptionPressed}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Layout.spacing.medium,
    alignItems: "center",
  },
  screenContainer: {
    padding: Layout.spacing.medium,
    width: Layout.window.width,
  },
  title: {
    fontSize: Layout.text.xxlarge,
    fontWeight: "500",
    marginBottom: Layout.spacing.medium,
  },
  keyboardContainer: {
    width: "100%",
  },
  inputContainer: {
    width: "100%",
  },
  item: {
    marginVertical: Layout.spacing.small,
  },
  field: {
    marginBottom: Layout.spacing.xsmall,
  },
  input: {
    borderWidth: 1,
    padding: Layout.spacing.medium,
    borderRadius: Layout.radius.small,
  },
});
