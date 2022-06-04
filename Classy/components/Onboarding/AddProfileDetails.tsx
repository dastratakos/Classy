import * as Haptics from "expo-haptics";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";

import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Text, View } from "../Themed";

import ActionSheet from "react-native-actionsheet";
import AppContext from "../../context/Context";
import AppStyles from "../../styles/AppStyles";
import Button from "../Buttons/Button";
import Colors from "../../constants/Colors";
import { Degree } from "../../types";
import DropDownPicker from "react-native-dropdown-picker";
import Layout from "../../constants/Layout";
import ProfilePhoto from "../ProfilePhoto";
import { SaveFormat } from "expo-image-manipulator";
import Separator from "../Separator";
import { uploadImage } from "../../services/storage";
import useColorScheme from "../../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import { yearList } from "../../utils/yearList";

export default function AddProfileDetails({
  photoUrl,
  setPhotoUrl,
  name,
  setName,
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
  startYear: string;
  setStartYear: (arg0: string) => void;
  gradYear: string;
  setGradYear: (arg0: string) => void;
  errorMessage: string;
  setErrorMessage: (arg0: string) => void;
}) {
  const context = useContext(AppContext);
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  console.log("context.user:", context.user);

  const [startYearOpen, setStartYearOpen] = useState(false);
  const [startYearItems, setStartYearItems] = useState(yearList);
  const onStartYearOpen = useCallback(() => {
    setGradYearOpen(false);
  }, []);

  const [gradYearOpen, setGradYearOpen] = useState(false);
  const [gradYearItems, setGradYearItems] = useState(yearList);
  const onGradYearOpen = useCallback(() => {
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
          [{ resize: { width: 750, height: 750 } }],
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
                style={[
                  styles.input,
                  {
                    color: Colors[colorScheme].text,
                    borderColor: Colors[colorScheme].text,
                  },
                ]}
                autoCapitalize="words"
                textContentType="name"
              />
            </View>
            <View style={styles.item}>
              <View style={styles.field}>
                <Text>Degrees</Text>
              </View>
              {context.user.degrees &&
                context.user.degrees.map((degree: Degree, i: number) => (
                  <TouchableOpacity
                    style={[
                      AppStyles.row,
                      styles.input,
                      {
                        marginVertical: Layout.spacing.small,
                        borderColor: Colors[colorScheme].text,
                      },
                    ]}
                    key={i.toString()}
                    onPress={() => {
                      context.setEditDegreeIndex(i);
                      navigation.navigate("EditDegree");
                    }}
                  >
                    <Text>{degree.degree}</Text>
                    <Text>{degree.major}</Text>
                  </TouchableOpacity>
                ))}
              <View style={{ height: Layout.spacing.medium }} />
              <Button
                text="Add Degree"
                emphasized={
                  context.user.degrees
                    ? context.user.degrees.length === 0
                    : true
                }
                onPress={() => {
                  let newDegrees: Degree[] = [];
                  if (context.user.degrees)
                    newDegrees = [...context.user.degrees];
                  newDegrees.push({ degree: "", major: "" });
                  context.setUser({ ...context.user, degrees: newDegrees });
                  context.setEditDegreeIndex(newDegrees.length - 1);
                  navigation.navigate("AddDegree");
                }}
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
                  placeholder="Start Year"
                  placeholderStyle={{ color: Colors[colorScheme].text }}
                  searchable
                  searchPlaceholder="Search..."
                  showBadgeDot={false}
                  dropDownDirection="TOP"
                  modalProps={{ animationType: "slide" }}
                  theme={colorScheme === "light" ? "LIGHT" : "DARK"}
                  style={{
                    backgroundColor: Colors[colorScheme].background,
                    borderColor: Colors[colorScheme].text,
                  }}
                  dropDownContainerStyle={{
                    backgroundColor: Colors[colorScheme].background,
                    borderColor: Colors[colorScheme].text,
                  }}
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
                  placeholder="Graduation Year"
                  placeholderStyle={{
                    color: Colors[colorScheme].text,
                  }}
                  searchable
                  searchPlaceholder="Search..."
                  showBadgeDot={false}
                  dropDownDirection="TOP"
                  modalProps={{ animationType: "slide" }}
                  theme={colorScheme === "light" ? "LIGHT" : "DARK"}
                  style={{
                    backgroundColor: Colors[colorScheme].background,
                    borderColor: Colors[colorScheme].text,
                  }}
                  dropDownContainerStyle={{
                    backgroundColor: Colors[colorScheme].background,
                    borderColor: Colors[colorScheme].text,
                  }}
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
