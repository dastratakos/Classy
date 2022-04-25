import * as WebBrowser from "expo-web-browser";

import { ScrollView, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import { useCallback, useState } from "react";

import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import Colors from "../constants/Colors";
import { CourseProps } from "../types";
import FriendCard from "../components/FriendCard";
import Layout from "../constants/Layout";
import Separator from "../components/Separator";
import WideButton from "../components/Buttons/WideButton";
import useColorScheme from "../hooks/useColorScheme";
import ReadMoreText from "../components/ReadMoreText";

const friends = {
  aut2020: [
    {
      id: "30dmw08jM3MgRTFdG0oNuuCz4473",
      name: "Jiwon Lee",
      major: "Computer Science",
      gradYear: "2022 (Senior)",
      photoUrl:
        "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/30dmw08jM3MgRTFdG0oNuuCz4473%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
    },
    {
      id: "30dmw08jM3MgRTFdG0oNuuCz4473",
      name: "Melissa Daniel",
      major: "Computer Science",
      gradYear: "2022 (Senior)",
      photoUrl:
        "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/30dmw08jM3MgRTFdG0oNuuCz4473%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
    },
    {
      id: "30dmw08jM3MgRTFdG0oNuuCz4473",
      name: "Grace Alwan",
      major: "Computer Science",
      gradYear: "2022 (Senior)",
      photoUrl:
        "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/30dmw08jM3MgRTFdG0oNuuCz4473%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
    },
    {
      id: "30dmw08jM3MgRTFdG0oNuuCz4473",
      name: "Tara Jones",
      major: "Computer Science",
      gradYear: "2022 (Senior)",
      photoUrl:
        "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/30dmw08jM3MgRTFdG0oNuuCz4473%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
    },
    {
      id: "30dmw08jM3MgRTFdG0oNuuCz4473",
      name: "Melanie Kessinger",
      major: "Computer Science",
      gradYear: "2022 (Senior)",
      photoUrl:
        "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/30dmw08jM3MgRTFdG0oNuuCz4473%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
    },
  ],
  win2021: [
    {
      id: "30dmw08jM3MgRTFdG0oNuuCz4473",
      name: "Jiwon Lee",
      major: "Computer Science",
      gradYear: "2022 (Senior)",
      photoUrl:
        "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/30dmw08jM3MgRTFdG0oNuuCz4473%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
    },
    {
      id: "30dmw08jM3MgRTFdG0oNuuCz4473",
      name: "Melissa Daniel",
      major: "Computer Science",
      gradYear: "2022 (Senior)",
      photoUrl:
        "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/30dmw08jM3MgRTFdG0oNuuCz4473%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
    },
    {
      id: "30dmw08jM3MgRTFdG0oNuuCz4473",
      name: "Grace Alwan",
      major: "Computer Science",
      gradYear: "2022 (Senior)",
      photoUrl:
        "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/30dmw08jM3MgRTFdG0oNuuCz4473%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
    },
  ],
  spr2021: [
    {
      id: "30dmw08jM3MgRTFdG0oNuuCz4473",
      name: "Grace Alwan",
      major: "Computer Science",
      gradYear: "2022 (Senior)",
      photoUrl:
        "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/30dmw08jM3MgRTFdG0oNuuCz4473%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
    },
    {
      id: "30dmw08jM3MgRTFdG0oNuuCz4473",
      name: "Tara Jones",
      major: "Computer Science",
      gradYear: "2022 (Senior)",
      photoUrl:
        "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/30dmw08jM3MgRTFdG0oNuuCz4473%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
    },
    {
      id: "30dmw08jM3MgRTFdG0oNuuCz4473",
      name: "Melanie Kessinger",
      major: "Computer Science",
      gradYear: "2022 (Senior)",
      photoUrl:
        "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/30dmw08jM3MgRTFdG0oNuuCz4473%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
    },
  ],
  sum2021: [],
  aut2021: [
    {
      id: "30dmw08jM3MgRTFdG0oNuuCz4473",
      name: "Jiwon Lee",
      major: "Computer Science",
      gradYear: "2022 (Senior)",
      photoUrl:
        "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/30dmw08jM3MgRTFdG0oNuuCz4473%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
    },
    {
      id: "30dmw08jM3MgRTFdG0oNuuCz4473",
      name: "Melissa Daniel",
      major: "Computer Science",
      gradYear: "2022 (Senior)",
      photoUrl:
        "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/30dmw08jM3MgRTFdG0oNuuCz4473%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
    },
    {
      id: "30dmw08jM3MgRTFdG0oNuuCz4473",
      name: "Grace Alwan",
      major: "Computer Science",
      gradYear: "2022 (Senior)",
      photoUrl:
        "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/30dmw08jM3MgRTFdG0oNuuCz4473%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
    },
    {
      id: "30dmw08jM3MgRTFdG0oNuuCz4473",
      name: "Tara Jones",
      major: "Computer Science",
      gradYear: "2022 (Senior)",
      photoUrl:
        "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/30dmw08jM3MgRTFdG0oNuuCz4473%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
    },
    {
      id: "30dmw08jM3MgRTFdG0oNuuCz4473",
      name: "Melanie Kessinger",
      major: "Computer Science",
      gradYear: "2022 (Senior)",
      photoUrl:
        "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/30dmw08jM3MgRTFdG0oNuuCz4473%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
    },
  ],
  win2022: [
    {
      id: "30dmw08jM3MgRTFdG0oNuuCz4473",
      name: "Jiwon Lee",
      major: "Computer Science",
      gradYear: "2022 (Senior)",
      photoUrl:
        "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/30dmw08jM3MgRTFdG0oNuuCz4473%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
    },
    {
      id: "30dmw08jM3MgRTFdG0oNuuCz4473",
      name: "Melissa Daniel",
      major: "Computer Science",
      gradYear: "2022 (Senior)",
      photoUrl:
        "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/30dmw08jM3MgRTFdG0oNuuCz4473%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
    },
    {
      id: "30dmw08jM3MgRTFdG0oNuuCz4473",
      name: "Grace Alwan",
      major: "Computer Science",
      gradYear: "2022 (Senior)",
      photoUrl:
        "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/30dmw08jM3MgRTFdG0oNuuCz4473%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
    },
    {
      id: "30dmw08jM3MgRTFdG0oNuuCz4473",
      name: "Tara Jones",
      major: "Computer Science",
      gradYear: "2022 (Senior)",
      photoUrl:
        "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/30dmw08jM3MgRTFdG0oNuuCz4473%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
    },
    {
      id: "30dmw08jM3MgRTFdG0oNuuCz4473",
      name: "Melanie Kessinger",
      major: "Computer Science",
      gradYear: "2022 (Senior)",
      photoUrl:
        "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/30dmw08jM3MgRTFdG0oNuuCz4473%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
    },
  ],
  spr2022: [
    {
      id: "30dmw08jM3MgRTFdG0oNuuCz4473",
      name: "Jiwon Lee",
      major: "Computer Science",
      gradYear: "2022 (Senior)",
      photoUrl:
        "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/30dmw08jM3MgRTFdG0oNuuCz4473%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
    },
    {
      id: "30dmw08jM3MgRTFdG0oNuuCz4473",
      name: "Melissa Daniel",
      major: "Computer Science",
      gradYear: "2022 (Senior)",
      photoUrl:
        "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/30dmw08jM3MgRTFdG0oNuuCz4473%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
    },
    {
      id: "30dmw08jM3MgRTFdG0oNuuCz4473",
      name: "Grace Alwan",
      major: "Computer Science",
      gradYear: "2022 (Senior)",
      photoUrl:
        "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/30dmw08jM3MgRTFdG0oNuuCz4473%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
    },
    {
      id: "30dmw08jM3MgRTFdG0oNuuCz4473",
      name: "Tara Jones",
      major: "Computer Science",
      gradYear: "2022 (Senior)",
      photoUrl:
        "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/30dmw08jM3MgRTFdG0oNuuCz4473%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
    },
    {
      id: "30dmw08jM3MgRTFdG0oNuuCz4473",
      name: "Melanie Kessinger",
      major: "Computer Science",
      gradYear: "2022 (Senior)",
      photoUrl:
        "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/30dmw08jM3MgRTFdG0oNuuCz4473%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
    },
  ],
  sum2022: [],
};

const exploreCoursesLink =
  "https://explorecourses.stanford.edu/search?view=catalog&filter-coursestatus-Active=on&page=0&catalog=&academicYear=&q=";
// TODO: Carta requires Stanford sign-in...
const cartaLink = "https://carta-beta.stanford.edu/course/";

export default function Course({ route }: CourseProps) {
  const colorScheme = useColorScheme();

  const course = route.params.course;
  // console.log("🚀 ~ file: Course.tsx ~ line 259 ~ Course ~ course", course);

  return (
    <ScrollView
      style={{ backgroundColor: Colors[colorScheme].background }}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={AppStyles.section}>
        <Text style={styles.title}>
          {course.subject} {course.code}: {course.title}
        </Text>
        <Text style={styles.unitsWays}>
          Units: {course.unitsMin}
          {course.unitsMin === course.unitsMax ? "" : `-${course.unitsMax}`},
          GERS: {course.gers || "None"}
        </Text>
        <ReadMoreText text={course.description} />
        <View
          style={[
            AppStyles.row,
            {
              justifyContent: "space-between",
              marginVertical: Layout.spacing.medium,
            },
          ]}
        >
          <View style={{ width: "48%" }}>
            <Button
              text="Explore Courses"
              onPress={() =>
                handleExplorePress(course.administrativeInformation.courseId)
              }
            />
          </View>
          <View style={{ width: "48%" }}>
            <Button
              text="Carta"
              onPress={() =>
                handleCartaPress(`${course.subject}${course.code}`)
              }
            />
          </View>
        </View>
        <WideButton
          text="Add to Courses"
          onPress={() => console.log("Add to Courses pressed")}
        />
      </View>
      <Separator />
      <View style={styles.friendsSection}>
        <Text style={styles.friendsHeader}>Friends</Text>
        <Text style={{ marginBottom: Layout.spacing.medium }}>
          TODO: horizontal swipable list of quarters
        </Text>
        <View style={AppStyles.section}>
          {friends.spr2022.map((friend, i) => (
            <FriendCard
              id={friend.id}
              name={friend.name}
              major={friend.major}
              gradYear={friend.gradYear}
              photoUrl={friend.photoUrl}
              key={i}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function handleExplorePress(courseId: number) {
  WebBrowser.openBrowserAsync(`${exploreCoursesLink}${courseId}`);
}

function handleCartaPress(subjectAndCode: string) {
  WebBrowser.openBrowserAsync(cartaLink + subjectAndCode);
}

const styles = StyleSheet.create({
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
