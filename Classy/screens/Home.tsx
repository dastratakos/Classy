import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Text, View } from "../components/Themed";
import { useContext, useEffect, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import CourseOverview from "../components/Cards/CourseOverview";
import { HomeData } from "../types";
import Layout from "../constants/Layout";
import ProfilePhoto from "../components/ProfilePhoto";
import { Timestamp } from "firebase/firestore";
import dummyData from "./homeData";
import { getCurrentTermId } from "../utils";
import { getEnrollmentsForTerm } from "../services/enrollments";
import { getFriendsInCourse } from "../services/friends";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function Home() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  const [homeData, setHomeData] = useState<HomeData>([]);

  const [refreshing, setRefreshing] = useState<boolean>(true);

  const today = Timestamp.now().toDate().getDay() - 1;
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);

    const res = await getEnrollmentsForTerm(
      context.user.id,
      getCurrentTermId()
    );

    let homeDataArr = [];
    for (let enrollment of res) {
      const friends = await getFriendsInCourse(
        context.user.id,
        enrollment.courseId,
        getCurrentTermId()
      );

      for (let schedule of enrollment.schedules) {
        if (schedule.days.includes(daysOfWeek[today])) {
          const component = schedule.component;
          const startInfo = schedule.startInfo;
          const endInfo = schedule.endInfo;
          homeDataArr.push({
            enrollment,
            friends,
            startInfo,
            endInfo,
            component,
          });
        }
      }
    }
    setHomeData(homeDataArr);

    // let dummyDataArr = [];
    // for (let object of dummyData) {
    //   const enrollment = object.enrollment;
    //   const friends = object.friends;
    //   for (let schedule of enrollment.schedules) {
    //     if (schedule.days.includes(daysOfWeek[today])) {
    //       const component = schedule.component;
    //       const startInfo = schedule.startInfo;
    //       const endInfo = schedule.endInfo;
    //       dummyDataArr.push({ enrollment, friends, startInfo, endInfo, component });
    //     };
    //   };
    // };

    // setHomeData(dummyDataArr);

    setRefreshing(false);
  };

  return (
    <ScrollView
      style={{ backgroundColor: Colors[colorScheme].background }}
      contentContainerStyle={{ alignItems: "center" }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={AppStyles.section}>
        <View style={AppStyles.row}>
          <View style={[AppStyles.row, { flex: 1 }]}>
            <View style={{ flexGrow: 1 }}>
              <Text style={styles.title}>
                Hi{context.user.name && `, ${context.user.name.split(" ")[0]}`}.
              </Text>
              <Text style={styles.subtitle}>
                <Text>Your </Text>
                <Text style={{ fontWeight: "bold" }}>{daysOfWeek[today]}</Text>
              </Text>
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
              key={`${item.enrollment.courseId}`}
              enrollment={item.enrollment}
              friends={item.friends}
              startInfo={item.startInfo}
              endInfo={item.endInfo}
              component={item.component}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    marginTop: Layout.spacing.small,
    fontSize: Layout.text.xxlarge,
  },
  title: {
    fontSize: Layout.text.large,
  },
});
