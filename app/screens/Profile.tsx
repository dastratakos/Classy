import { FontAwesome } from "@expo/vector-icons";
import { ScrollView, StyleSheet } from "react-native";
import Button from "../components/Button";

import { Text, View } from "../components/Themed";
import WideButton from "../components/WideButton";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";

export default function Profile() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={styles.section}>
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <View>
            <View style={styles.row}>
              <View style={styles.photo}></View>
              <View>
                <Text style={styles.name}>Dean Stratakos</Text>
                <Button text={"Edit Profile"}></Button>
              </View>
            </View>
          </View>
          <Button text={"In Class"}></Button>
        </View>
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <View>
            {/* Major */}
            <View style={styles.row}>
              <FontAwesome
                name="pencil"
                size={25}
                color={Colors.light.text}
                style={{ width: 30, marginRight: 15 }}
              />
              <Text>Computer Science</Text>
            </View>
            {/* Class */}
            <View style={styles.row}>
              <FontAwesome
                name="graduation-cap"
                size={25}
                color={Colors.light.text}
                style={{ width: 30, marginRight: 15 }}
              />
              <Text>2022 (Senior)</Text>
            </View>
          </View>
          <Button text={"83\nfriends"}></Button>
        </View>
        <WideButton text={"View Courses"}></WideButton>
      </View>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View style={styles.section}>
        <Text>TODO: Calendar view</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  section: {
    width: "100%",
    padding: Layout.spacing.medium,
  },
  photo: {
    backgroundColor: Colors.imagePlaceholder,
    height: Layout.image.medium,
    width: Layout.image.medium,
    borderRadius: Layout.image.medium / 2,
    marginRight: Layout.spacing.medium,
  },
  name: {
    fontSize: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
