import { FontAwesome } from "@expo/vector-icons";
import { ScrollView, StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";
import SquareButton from "../components/Buttons/SquareButton";
import WideButton from "../components/Buttons/WideButton";
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
          <View style={styles.row}>
            <View style={styles.photo}></View>
            {/* <View> */}
            <View>
              <Text style={styles.name}>Dean Stratakos</Text>
              <View style={[styles.row, { marginTop: Layout.spacing.xsmall }]}>
                <View style={styles.status}></View>
                <Text style={styles.statusText}>In class</Text>
              </View>
            </View>
            {/* <Button text={"Edit Profile"}></Button> */}
            {/* </View> */}
          </View>
        </View>
        <View
          style={[
            styles.row,
            { justifyContent: "space-between", marginVertical: 15 },
          ]}
        >
          <View>
            {/* Major */}
            <View style={styles.row}>
              <View style={styles.iconWrapper}>
                <FontAwesome
                  name="pencil"
                  size={25}
                  color={Colors.light.text}
                />
              </View>
              <Text>Computer Science</Text>
            </View>
            {/* Class */}
            <View style={styles.row}>
              <View style={styles.iconWrapper}>
                <FontAwesome
                  name="graduation-cap"
                  size={25}
                  color={Colors.light.text}
                />
              </View>
              <Text>2022 (Senior)</Text>
            </View>
          </View>
          <SquareButton num={83} text={"friends"}></SquareButton>
        </View>
        <WideButton text={"View Courses"}></WideButton>
      </View>
      <View
        style={styles.separator}
        lightColor="#ccc"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View style={styles.section}>
        <Text>TODO: Edit profile or Settings button</Text>
      </View>
      <View
        style={styles.separator}
        lightColor="#ccc"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View style={styles.section}>
        <Text>TODO: Calendar view</Text>
        {/* <View style={[styles.row, { justifyContent: "space-between" }]}>
          <View style={styles.day}>
            <Text>M</Text>
          </View>
          <View style={styles.day}>
            <Text>T</Text>
          </View>
          <View style={styles.day}>
            <Text>W</Text>
          </View>
          <View style={styles.day}>
            <Text>T</Text>
          </View>
          <View style={[styles.day, styles.daySelected]}>
            <Text style={styles.daySelected}>F</Text>
          </View>
        </View> */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
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
    marginRight: Layout.spacing.large,
  },
  name: {
    fontSize: Layout.text.xlarge,
  },
  status: {
    height: 10,
    width: 10,
    borderRadius: 10 / 2,
    backgroundColor: Colors.status.inClass,
  },
  statusText: {
    color: Colors.light.secondaryText,
    marginLeft: Layout.spacing.small,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    width: 30,
    marginRight: 15,
    alignItems: "center",
  },
  separator: {
    marginVertical: 10,
    height: 2,
    borderRadius: 1,
    width: "80%",
  },
  day: {
    alignItems: "center",
    justifyContent: "center",
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
    borderWidth: 1,
  },
  daySelected: {
    color: "#fff",
    backgroundColor: "red",
  },
});
