import { ScrollView, StyleSheet } from "react-native";
import { Icon, Text, View } from "../components/Themed";

import AppContext from "../context/Context";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import SquareButton from "../components/Buttons/SquareButton";
import WideButton from "../components/Buttons/WideButton";
import { useContext } from "react";
import { useNavigation } from "@react-navigation/core";
import useColorScheme from "../hooks/useColorScheme";

export default function Profile() {
  const context = useContext(AppContext);

  const navigation = useNavigation();

  const colorScheme = useColorScheme();

  return (
    <ScrollView
      style={{ backgroundColor: Colors[colorScheme].background }}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={styles.section}>
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <View style={styles.row}>
            <View
              style={[
                styles.photo,
                { backgroundColor: Colors[colorScheme].imagePlaceholder },
              ]}
            ></View>
            <View>
              <Text style={styles.name}>{context.userName}</Text>
              <View style={[styles.row, { marginTop: Layout.spacing.xsmall }]}>
                <View
                  style={[
                    styles.status,
                    context.userInClass ? styles.inClass : styles.notInClass,
                  ]}
                ></View>
                <Text
                  style={[
                    styles.statusText,
                    { color: Colors[colorScheme].secondaryText },
                  ]}
                >
                  {context.userInClass ? "In class" : "Not in class"}
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
                <Icon name="pencil" size={25} />
              </View>
              <Text>{context.userMajor}</Text>
            </View>
            {/* Graduation Year */}
            <View style={styles.row}>
              <View style={styles.iconWrapper}>
                <Icon name="graduation-cap" size={25} />
              </View>
              <Text>{context.userGradYear}</Text>
            </View>
          </View>
          <SquareButton
            num={context.userNumFriends}
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
        lightColor={Colors.light.imagePlaceholder}
        darkColor={Colors.dark.imagePlaceholder}
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
  section: {
    width: "100%",
    padding: Layout.spacing.medium,
  },
  photo: {
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
