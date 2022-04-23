import { ScrollView, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";

import Colors from "../constants/Colors";
import CourseCard from "../components/CourseCard";
import FriendCard from "../components/FriendCard";
import Layout from "../constants/Layout";
import WideButton from "../components/Buttons/WideButton";
import useColorScheme from "../hooks/useColorScheme";

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
  const colorScheme = useColorScheme();

  return (
    <ScrollView
      style={{ backgroundColor: Colors[colorScheme].background }}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={styles.section}>
        {friends.map((friend, i) => (
          <FriendCard
            name={friend.name}
            major={friend.major}
            gradYear={friend.gradYear}
            key={i}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    width: "100%",
    padding: Layout.spacing.medium,
  },
});
