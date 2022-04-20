import * as WebBrowser from "expo-web-browser";

import { ScrollView, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";

import Button from "../components/Buttons/Button";
import Colors from "../constants/Colors";
import FriendCard from "../components/FriendCard";
import Layout from "../constants/Layout";
import WideButton from "../components/Buttons/WideButton";
import useColorScheme from "../hooks/useColorScheme";

const course = {
  code: "CS 194W",
  title: "Software Project (WIM)",
  units: "3",
  ways: "None",
  description:
    "Restricted to Computer Science and Electrical Engineering undergraduates. Writing-intensive version of CS 194W. Preference given to seniors.",
};

const friends = {
  aut2020: [
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
  ],
  win2021: [
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
  ],
  spr2021: [
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
  ],
  sum2021: [],
  aut2021: [
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
  ],
  win2022: [
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
  ],
  spr2022: [
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
  ],
  sum2022: [],
};

const exploreCoursesLink =
  "https://explorecourses.stanford.edu/search?view=catalog&filter-coursestatus-Active=on&page=0&catalog=&academicYear=&q=cs+194w&collapse=";
// TODO: Carta requires Stanford sign-in...
const cartaLink = "https://carta-beta.stanford.edu/course/CS%20194W/1226";

export default function Course() {
  const colorScheme = useColorScheme();

  return (
    <ScrollView
      style={{ backgroundColor: Colors[colorScheme].background }}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={styles.section}>
        <Text style={styles.title}>
          {course.code}: {course.title}
        </Text>
        <Text style={styles.unitsWays}>
          Units: {course.units}, WAYS: {course.ways}
        </Text>
        {/* TODO: start with 5 lines max and have a "read more" button */}
        <Text style={styles.description}>{course.description}</Text>
        <View style={styles.row}>
          <View style={{ width: "48%" }}>
            <Button text="Explore Courses" onPress={handleExplorePress} />
          </View>
          <View style={{ width: "48%" }}>
            <Button text="Carta" onPress={handleCartaPress} />
          </View>
        </View>
        <WideButton
          text="Add to Courses"
          onPress={() => console.log("Add to Courses pressed")}
        />
      </View>
      <View
        style={styles.separator}
        lightColor={Colors.light.imagePlaceholder}
        darkColor={Colors.dark.imagePlaceholder}
      />
      <View style={styles.friendsSection}>
        <Text style={styles.friendsHeader}>Friends</Text>
        <Text style={{ marginBottom: Layout.spacing.medium }}>
          TODO: horizontal swipable list of quarters
        </Text>
        <View style={styles.section}>
          {friends.spr2022.map((friend, i) => (
            <FriendCard
              name={friend.name}
              major={friend.major}
              gradYear={friend.gradYear}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function handleExplorePress() {
  WebBrowser.openBrowserAsync(exploreCoursesLink);
}

function handleCartaPress() {
  WebBrowser.openBrowserAsync(cartaLink);
}

const styles = StyleSheet.create({
  section: {
    width: "100%",
    padding: Layout.spacing.medium,
  },
  separator: {
    marginVertical: 10,
    height: 2,
    borderRadius: 1,
    width: "80%",
  },
  title: {
    fontSize: Layout.text.xlarge,
    fontWeight: "500",
    marginBottom: Layout.spacing.small,
  },
  unitsWays: {
    fontWeight: "bold",
    color: Colors.status.inClass,
    marginBottom: Layout.spacing.small,
  },
  description: {},
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: Layout.spacing.medium,
  },
  friendsSection: {
    width: "100%",
    alignItems: "center",
  },
  friendsHeader: {
    fontSize: Layout.text.large,
    fontWeight: "500",
    marginTop: Layout.spacing.small,
    marginBottom: Layout.spacing.medium,
  },
});
