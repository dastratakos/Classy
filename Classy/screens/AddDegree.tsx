import * as Haptics from "expo-haptics";

import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "../components/Themed";
import { useCallback, useContext, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import Colors from "../constants/Colors";
import DropDownPicker from "react-native-dropdown-picker";
import EmptyList from "../components/EmptyList";
import Layout from "../constants/Layout";
import SVGEducation from "../assets/images/undraw/education.svg";
import { degreeList } from "../utils/degreeList";
import { majorList } from "../utils/majorList";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import { Degree, User } from "../types";
import { updateUser } from "../services/users";

export default function AddDegree() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  const [degree, setDegree] = useState(
    context.user.degrees
      ? context.user.degrees[context.editDegreeIndex].degree
      : ""
  );
  const [degreeOpen, setDegreeOpen] = useState(false);
  // TODO: add logic for custom degree
  const [degreeItems, setDegreeItems] = useState(degreeList);
  const onDegreeOpen = useCallback(() => setMajorOpen(false), []);

  const [major, setMajor] = useState(
    context.user.degrees
      ? context.user.degrees[context.editDegreeIndex].major
      : ""
  );
  const [majorOpen, setMajorOpen] = useState(false);
  // TODO: add logic for custom major
  const [majorItems, setMajorItems] = useState(majorList);
  const onMajorOpen = useCallback(() => setDegreeOpen(false), []);

  const [doneLoading, setDoneLoading] = useState<boolean>(false);

  const handleCancelPressed = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setDoneLoading(true);

    let newDegrees: Degree[] = [];
    if (context.user.degrees) newDegrees = [...context.user.degrees];
    newDegrees.pop();

    const newUser: User = {
      ...context.user,
      degrees: newDegrees,
    };

    context.setUser(newUser);

    setDoneLoading(false);
    navigation.goBack();
  };

  const handleDonePressed = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setDoneLoading(true);

    let newDegrees: Degree[] = [];
    if (context.user.degrees) newDegrees = [...context.user.degrees];
    newDegrees[context.editDegreeIndex] = { degree, major };

    const newUser: User = {
      ...context.user,
      degrees: newDegrees,
    };

    context.setUser(newUser);
    updateUser(context.user.id, newUser);

    setDoneLoading(false);
    navigation.goBack();
  };

  return (
    <View style={[AppStyles.section, { flex: 1 }]}>
      <View style={{ height: "50%" }}>
        <EmptyList
          SVGElement={SVGEducation}
          primaryText="Add a degree"
          secondaryText={
            "Choose an official degree and major," + "\n" + "or enter your own!"
          }
        />
      </View>
      <DropDownPicker
        open={degreeOpen}
        onOpen={onDegreeOpen}
        value={degree}
        items={degreeItems}
        setOpen={setDegreeOpen}
        setValue={setDegree}
        placeholder="Degree"
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
        containerStyle={{ marginBottom: Layout.spacing.large }}
      />
      <DropDownPicker
        open={majorOpen}
        onOpen={onMajorOpen}
        value={major}
        items={majorItems}
        setOpen={setMajorOpen}
        setValue={setMajor}
        placeholder="Major"
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
        containerStyle={{ marginBottom: Layout.spacing.large }}
      />
      <View style={AppStyles.row}>
        <View style={{ width: "48%", backgroundColor: "transparent" }}>
          <Button text="Cancel" onPress={handleCancelPressed} />
        </View>
        <View style={{ width: "48%", backgroundColor: "transparent" }}>
          <Button
            text="Done"
            onPress={handleDonePressed}
            loading={doneLoading}
            emphasized
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
