import * as WebBrowser from 'expo-web-browser';

import { ScrollView, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";

import Colors from "../constants/Colors";
import CourseCard from "../components/CourseCard";
import { FontAwesome } from "@expo/vector-icons";
import Layout from "../constants/Layout";
import SquareButton from "../components/Buttons/SquareButton";
import WideButton from "../components/Buttons/WideButton";

export default function Course() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={styles.section}>
        <WideButton text={"TODO"} onPress={() => {}}></WideButton>
      </View>
      <View
        style={styles.separator}
        lightColor="#ccc"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View style={styles.section}>
        <Text>TODO: Single course</Text>
      </View>
      <WideButton text="Explore Courses" onPress={handleExplorePress} />
      <WideButton text="Carta" onPress={handleCartaPress} />
    </ScrollView>
  );
}

function handleExplorePress() {
  WebBrowser.openBrowserAsync(
    'https://explorecourses.stanford.edu/search?view=catalog&filter-coursestatus-Active=on&page=0&catalog=&academicYear=&q=cs+194w&collapse='
  );
}

// TODO: Carta requires Stanford sign-in...
function handleCartaPress() {
  WebBrowser.openBrowserAsync(
    'https://carta-beta.stanford.edu/course/CS%20194W/1226'
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
