import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import { Timestamp } from "firebase/firestore";
import { Text, View } from "../components/Themed";
import { useContext, useEffect, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { getCurrentTermId } from "../utils";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import { getEnrollmentsForTerm } from "../services/enrollments";
import { HomeData } from "../types";
import CourseOverview from "../components/CourseOverview";
import ProfilePhoto from "../components/ProfilePhoto";
import { getFriendsInCourse } from "../services/friends";

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
      homeDataArr.push({ enrollment, friends });
    }
    setHomeData(homeDataArr);

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
              key={`${item.enrollment.courseId}`}
              code={item.enrollment.code.join(", ")}
              time={"TODO"}
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
