import { Pressable, StyleSheet } from "react-native";
import { Icon, Text, View } from "./Themed";

import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import useColorScheme from "../hooks/useColorScheme";

import DropDownPicker from "react-native-dropdown-picker";

export default function DegreePicker({
  degree,
  setDegree,
  degreeOpen,
  setDegreeOpen,
  degreeItems,
  onDegreeOpen,
  major,
  setMajor,
  majorOpen,
  setMajorOpen,
  majorItems,
  onMajorOpen,
  onDeleteDegree,
}: {
  degree: string;
  setDegree: (arg0: string) => void;
  degreeOpen: boolean;
  setDegreeOpen: (arg0: boolean) => void;
  degreeItems: { label: string; value: string }[];
  onDegreeOpen: () => void;
  major: string;
  setMajor: (arg0: string) => void;
  majorOpen: boolean;
  setMajorOpen: (arg0: boolean) => void;
  majorItems: { label: string; value: string }[];
  onMajorOpen: () => void;
  onDeleteDegree: () => void;
}) {
  const colorScheme = useColorScheme();

  return (
    <View style={AppStyles.row}>
      <View style={[styles.item, { width: "28%" }]}>
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
        />
      </View>
      <View style={[styles.item, { width: "60%" }]}>
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
        />
      </View>
      <Pressable style={styles.minusIcon} onPress={onDeleteDegree}>
        <Icon
          name="minus"
          size={Layout.icon.small}
          lightColor={Colors.white}
          darkColor={Colors.white}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    marginVertical: Layout.spacing.small,
  },
  minusIcon: {
    backgroundColor: Colors.deepRed,
    height: Layout.icon.medium,
    width: Layout.icon.medium,
    borderRadius: Layout.icon.medium / 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
