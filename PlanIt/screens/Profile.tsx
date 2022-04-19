import { ScrollView, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";

import Colors from "../constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import Layout from "../constants/Layout";
import SquareButton from "../components/Buttons/SquareButton";
import WideButton from "../components/Buttons/WideButton";
import { useNavigation } from "@react-navigation/core";

const profile = {
  name: "Dean Stratakos",
  inClass: true,
  major: "Computer Science",
  gradYear: "2022 (Senior)",
  numFriends: "83",
};

export default function Profile() {
  const navigation = useNavigation();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={styles.section}>
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <View style={styles.row}>
            <View style={styles.photo}></View>
            <View>
              <Text style={styles.name}>{profile.name}</Text>
              <View style={[styles.row, { marginTop: Layout.spacing.xsmall }]}>
                <View
                  style={[
                    styles.status,
                    profile.inClass ? styles.inClass : styles.notInClass,
                  ]}
                ></View>
                <Text style={styles.statusText}>
                  {profile.inClass ? "In class" : "Not in class"}
                </Text>
              </View>
            </View>
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
              <Text>{profile.major}</Text>
            </View>
            {/* Graduation Year */}
            <View style={styles.row}>
              <View style={styles.iconWrapper}>
                <FontAwesome
                  name="graduation-cap"
                  size={25}
                  color={Colors.light.text}
                />
              </View>
              <Text>{profile.gradYear}</Text>
            </View>
          </View>
          <SquareButton
            num={profile.numFriends}
            text="friends"
            onPress={() => navigation.navigate("Friends")}
          />
        </View>
        <WideButton
          text={"View Courses"}
          onPress={() => navigation.navigate("Courses")}
        ></WideButton>
      </View>
      <View
        style={styles.separator}
        lightColor="#ccc"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View style={styles.section}>
        <Text style={{ alignSelf: "center" }}>TODO: Calendar view</Text>
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
  },
  inClass: {
    backgroundColor: Colors.status.inClass,
  },
  notInClass: {
    backgroundColor: Colors.status.notInClass,
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
