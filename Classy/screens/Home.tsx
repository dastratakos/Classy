import { ScrollView, StyleSheet, Pressable } from "react-native";
import { Timestamp } from "firebase/firestore";
import { Text, View } from "../components/Themed";
import { useContext, useEffect, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { getCurrentTermId, termIdToFullName } from "../utils";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import { getEnrollmentsForTerm } from "../services/enrollments";
import { Enrollment } from "../types";
import homeData from "./homeData";
import CourseOverview from "../components/CourseOverview";
import ProfilePhoto from "../components/ProfilePhoto";

export default function Home() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  const today = Timestamp.now().toDate().getDay() - 1;
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]; // is this too hacky? lol

  useEffect(() => {
    const loadScreen = async () => {
      setEnrollments(
        await getEnrollmentsForTerm(context.user.id, getCurrentTermId())
      );
    };
    loadScreen();
  }, []);

  return (
    <ScrollView
      style={{ backgroundColor: Colors[colorScheme].background }}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={AppStyles.section}>
        <View style={AppStyles.row}>
          <View style={[AppStyles.row, { flex: 1 }]}>
            <View style={{ flexGrow: 1 }}>
              <Text>
                Hi{context.user.name && `, ${context.user.name.split(" ")[0]}`}
              </Text>
              <Text>Your {daysOfWeek[today]}</Text>
            </View>
            <Pressable
              onPress={() =>
                navigation.navigate("ProfileStack", {
                  screen: "Profile",
                })
              }
            >
              <ProfilePhoto
                url={context.user.photoUrl}
                size={Layout.photo.medium}
              />
            </Pressable>
          </View>
        </View>
        <View>
          {homeData.map((item) => (
            <CourseOverview
              key={item.code}
              code={item.code}
              time={item.time}
              friends={item.friends}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: Layout.spacing.xlarge,
    fontSize: Layout.text.xlarge,
  },
});
