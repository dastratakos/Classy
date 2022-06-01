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

export default function EditDegree() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  const initialDegree = context.user.degrees
    ? context.user.degrees[context.editDegreeIndex].degree
    : "";
  const initialDegreeObj = {
    label: initialDegree,
    value: initialDegree,
  };
  const [degreeItems, setDegreeItems] = useState(
    degreeList.includes(initialDegreeObj) || initialDegree === ""
      ? degreeList
      : [...degreeList, initialDegreeObj]
  );
  const [degree, setDegree] = useState(initialDegree);
  const [degreeOpen, setDegreeOpen] = useState(false);
  const onDegreeOpen = useCallback(() => setMajorOpen(false), []);

  const initialMajor = context.user.degrees
    ? context.user.degrees[context.editDegreeIndex].major
    : "";
  const initialMajorObj = {
    label: initialMajor,
    value: initialMajor,
  };
  const [majorItems, setMajorItems] = useState(
    majorList.includes(initialMajorObj) || initialMajor === ""
      ? majorList
      : [...majorList, initialMajorObj]
  );
  const [major, setMajor] = useState(initialMajor);
  const [majorOpen, setMajorOpen] = useState(false);
  const onMajorOpen = useCallback(() => setDegreeOpen(false), []);

  const [doneLoading, setDoneLoading] = useState<boolean>(false);

  const handleDeletePressed = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    let newDegrees: Degree[] = [];
    if (context.user.degrees) newDegrees = [...context.user.degrees];
    newDegrees.splice(context.editDegreeIndex, 1);

    const newUser: User = {
      ...context.user,
      degrees: newDegrees,
    };

    context.setUser(newUser);
    updateUser(context.user.id, newUser);

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
          primaryText="Edit your degree"
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
        setItems={setDegreeItems}
        setOpen={setDegreeOpen}
        setValue={setDegree}
        placeholder="Degree"
        placeholderStyle={{ color: Colors[colorScheme].secondaryText }}
        searchable
        addCustomItem
        searchPlaceholder="Search..."
        showBadgeDot={false}
        dropDownDirection="TOP"
        modalProps={{ animationType: "slide" }}
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
        setItems={setMajorItems}
        setOpen={setMajorOpen}
        setValue={setMajor}
        placeholder="Major"
        placeholderStyle={{ color: Colors[colorScheme].secondaryText }}
        searchable
        addCustomItem
        searchPlaceholder="Search..."
        showBadgeDot={false}
        dropDownDirection="TOP"
        modalProps={{ animationType: "slide" }}
        theme={colorScheme === "light" ? "LIGHT" : "DARK"}
        style={{ backgroundColor: Colors[colorScheme].background }}
        dropDownContainerStyle={{
          backgroundColor: Colors[colorScheme].background,
        }}
        containerStyle={{ marginBottom: Layout.spacing.large }}
      />
      <Button
        text="Delete"
        onPress={handleDeletePressed}
        containerStyle={{ backgroundColor: Colors.pink }}
        textStyle={{ color: Colors.white }}
      />
      <View style={[AppStyles.row, { marginTop: Layout.spacing.medium }]}>
        <View style={{ width: "48%", backgroundColor: "transparent" }}>
          <Button
            text="Cancel"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              navigation.goBack();
            }}
          />
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
