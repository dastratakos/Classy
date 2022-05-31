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
import { Text, View } from "../components/Themed";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

import ActionSheet from "react-native-actionsheet";
import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import Colors from "../constants/Colors";
import DropDownPicker from "react-native-dropdown-picker";
import Layout from "../constants/Layout";
import ProfilePhoto from "../components/ProfilePhoto";
import { SaveFormat } from "expo-image-manipulator";
import Separator from "../components/Separator";
import { Degree, User } from "../types";
import { auth } from "../firebase";
import { generateSubstrings } from "../utils";
import { generateTerms, updateUser } from "../services/users";
import { uploadImage } from "../services/storage";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import { yearList } from "../utils/yearList";
import { degreeList } from "../utils/degreeList";

export default function Settings() {
  const context = useContext(AppContext);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const [photoUrl, setPhotoUrl] = useState(context.user.photoUrl || "");
  const [name, setName] = useState(context.user.name || "");

  const [degrees, setDegrees] = useState<Degree[]>(context.user.degrees || []);

  const [startYear, setStartYear] = useState(context.user.startYear || "");
  const [startYearOpen, setStartYearOpen] = useState(false);
  const [startYearItems, setStartYearItems] = useState(yearList);
  const onStartYearOpen = useCallback(() => {
    setGradYearOpen(false);
  }, []);

  const [gradYear, setGradYear] = useState(context.user.gradYear || "");
  const [gradYearOpen, setGradYearOpen] = useState(false);
  const [gradYearItems, setGradYearItems] = useState(yearList);
  const onGradYearOpen = useCallback(() => {
    setStartYearOpen(false);
  }, []);

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (startYear > gradYear) {
      alert("Error: StartYear cannot be after Graduation Year");
      return;
    }

    const newUser: User = {
      ...context.user,
      name,
      degrees,
      startYear,
      gradYear,
      interests,
      photoUrl,
      keywords: generateSubstrings(name),
      terms: generateTerms(context.user.terms, startYear, gradYear),
    };

    context.setUser(newUser);
    updateUser(context.user.id, newUser);
    context.streamClient.partialUpdateUser({
      id: context.user.id,
      set: {
        name: name,
        image: photoUrl,
      },
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
          [{ resize: { width: 750, height: 750 } }],
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
          photoUrl: uploadUrl,
        };
        context.setUser(newUser);

        updateUser(context.user.id, newUser);

        context.streamClient.partialUpdateUser({
          id: context.user.id,
          set: {
            name: name,
            image: photoUrl,
          },
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
    <>
      <ScrollView
        style={[
          styles.container,
          { backgroundColor: Colors[colorScheme].background },
          // { alignItems: "center" },
        ]}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          contentContainerStyle={{ alignItems: "center" }}
          behavior="position"
        >
          <ProfilePhoto
            url={photoUrl}
            size={Layout.photo.xlarge}
            style={{ marginBottom: Layout.spacing.medium }}
            loading={uploading}
            withModal
          />
          <Button
            text="Change profile photo"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              actionSheetRef.current?.show();
            }}
          />
          <Separator
            overrideStyles={{ marginTop: Layout.spacing.large, width: "100%" }}
          />
          <View style={styles.inputContainer}>
            <View style={styles.item}>
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
            <View style={styles.item}>
              <View style={styles.field}>
                <Text>Degrees</Text>
              </View>
              {degrees.map((degree: Degree, i: number) => (
                <TouchableOpacity
                  style={[
                    AppStyles.row,
                    styles.input,
                    { marginVertical: Layout.spacing.small },
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
                  const newDegrees = [
                    ...context.user.degrees,
                    { degree: "", major: "" },
                  ];
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
                  setValue={(text) => {
                    setStartYear(text);
                    setSaveDisabled(false);
                  }}
                  setItems={setStartYearItems}
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
                  dropDownContainerStyle={{
                    backgroundColor: Colors[colorScheme].background,
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
                  setValue={(text) => {
                    setGradYear(text);
                    setSaveDisabled(false);
                  }}
                  setItems={setGradYearItems}
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
                  dropDownContainerStyle={{
                    backgroundColor: Colors[colorScheme].background,
                  }}
                />
              </View>
            </View>
            <View style={styles.item}>
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
            <View style={styles.item}>
              <View style={styles.field}>
                <Text>Email</Text>
              </View>
              <Text
                style={[
                  styles.input,
                  { color: Colors[colorScheme].secondaryText },
                ]}
              >
                {auth.currentUser?.email}
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>
        <Separator
          overrideStyles={{ marginBottom: Layout.spacing.large, width: "100%" }}
        />
        <Button
          text="Manage Account"
          onPress={() => navigation.navigate("ManageAccount")}
          wide
          containerStyle={{
            marginBottom: Layout.spacing.xxxlarge + Layout.buttonHeight.medium,
          }}
        />
        <ActionSheet
          ref={actionSheetRef}
          options={actionSheetOptions}
          cancelButtonIndex={actionSheetOptions.length - 1}
          destructiveButtonIndex={0}
          onPress={handleActionSheetOptionPressed}
        />
      </ScrollView>
      <View style={styles.ctaContainer}>
        <View style={{ width: "48%", backgroundColor: "transparent" }}>
          <Button text="Cancel" onPress={() => navigation.goBack()} />
        </View>
        <View style={{ width: "48%", backgroundColor: "transparent" }}>
          <Button
            text="Save Changes"
            onPress={handleSavePress}
            disabled={saveDisabled}
            emphasized
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Layout.spacing.medium,
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
  ctaContainer: {
    ...AppStyles.row,
    position: "absolute",
    bottom: Layout.spacing.medium,
    left: Layout.spacing.medium,
    right: Layout.spacing.medium,
    backgroundColor: "transparent",
  },
});
