import { ScrollView, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";

import Colors from "../constants/Colors";
import CourseCard from "../components/CourseCard";
import { FontAwesome } from "@expo/vector-icons";
import FriendCard from "../components/FriendCard";
import Layout from "../constants/Layout";
import WideButton from "../components/Buttons/WideButton";

const friends = [
  {
    name: "Jiwon Lee",
    major: "Computer Science",
    gradYear: "2022 (Senior)",
  },
  {
    name: "Melissa Daniel",
    major: "Computer Science",
    gradYear: "2022 (Senior)",
  },
  {
    name: "Grace Alwan",
    major: "Computer Science",
    gradYear: "2022 (Senior)",
  },
  {
    name: "Tara Jones",
    major: "Computer Science",
    gradYear: "2022 (Senior)",
  },
  {
    name: "Melanie Kessinger",
    major: "Computer Science",
    gradYear: "2022 (Senior)",
  },
];

export default function Friends() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={styles.section}>
        {friends.map((friend, i) => (
          <FriendCard
            name={friend.name}
            major={friend.major}
            gradYear={friend.gradYear}
          />
        ))}
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
