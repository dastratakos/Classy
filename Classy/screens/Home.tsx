import { ActivityIndicator, Text, View } from "../components/Themed";
import { CourseOverview as CourseOverviewType, HomeData } from "../types";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useContext, useEffect, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import CourseOverview from "../components/Cards/CourseOverview";
import EmptyList from "../components/EmptyList";
import Layout from "../constants/Layout";
import ProfilePhoto from "../components/ProfilePhoto";
import SVGRelax from "../assets/images/undraw/relax.svg";
import Separator from "../components/Separator";
import { Timestamp } from "firebase/firestore";
import { getCurrentTermId } from "../utils";
import { getEnrollmentsForTerm } from "../services/enrollments";
import { getFriendsInCourse } from "../services/friends";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function Home() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  const [homeData, setHomeData] = useState<HomeData>({ today: [], nextUp: [] });

  const [refreshing, setRefreshing] = useState<boolean>(true);

  const today = Timestamp.now().toDate().getDay();
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
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

    let todayArr: CourseOverviewType[] = [];
    let nextUpArr: CourseOverviewType[] = [];
    for (let enrollment of res) {
      const friends = await getFriendsInCourse(
        context.user.id,
        enrollment.courseId,
        getCurrentTermId()
      );

      for (let schedule of enrollment.schedules) {
        if (schedule.days.includes(daysOfWeek[today])) {
          todayArr.push({
            enrollment,
            friends,
            startInfo: schedule.startInfo,
            endInfo: schedule.endInfo,
            component: schedule.component,
          });
        }
        if (schedule.days.includes(daysOfWeek[today < 5 ? today + 1 : 1])) {
          nextUpArr.push({
            enrollment,
            friends,
            startInfo: schedule.startInfo,
            endInfo: schedule.endInfo,
            component: schedule.component,
          });
        }
      }
    }
    todayArr.sort((a, b) => (a.startInfo > b.startInfo ? 1 : -1));
    nextUpArr.sort((a, b) => (a.startInfo > b.startInfo ? 1 : -1));
    setHomeData({ today: todayArr, nextUp: nextUpArr });

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
                Hi{context.user.name && `, ${context.user.name.split(" ")[0]}!`}
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
      </View>
      <View style={AppStyles.section}>
        {homeData.today.map((item) => (
          <View key={item.enrollment.courseId.toString()}>
            <CourseOverview data={item} />
          </View>
        ))}
        {homeData.today.length === 0 && (
          <>
            {refreshing ? (
              <ActivityIndicator />
            ) : (
              <EmptyList
                SVGElement={SVGRelax}
                primaryText="No classes"
                secondaryText="Enjoy the day off!"
              />
            )}
          </>
        )}
      </View>
      <Separator />
      <View style={AppStyles.section}>
        <Text style={styles.subtitle}>
          <Text>Up next on </Text>
          <Text style={{ fontWeight: "bold" }}>
            {daysOfWeek[today < 5 ? today + 1 : 1]}
          </Text>
        </Text>
      </View>
      <View style={AppStyles.section}>
        {homeData.nextUp.map((item) => (
          <View key={item.enrollment.courseId.toString()}>
            <CourseOverview data={item} />
          </View>
        ))}
        {homeData.nextUp.length === 0 && (
          <>
            {refreshing ? (
              <ActivityIndicator />
            ) : (
              <EmptyList
                SVGElement={SVGRelax}
                primaryText="No classes"
                secondaryText="Enjoy the day off!"
              />
            )}
          </>
        )}
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
