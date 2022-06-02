import { ScrollView, StyleSheet } from "react-native";
import { useContext, useEffect, useState } from "react";

import { ActivityIndicator } from "../components/Themed";
import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Calendar from "../components/Calendar/Calendar";
import Colors from "../constants/Colors";
import { View } from "../components/Themed";
import { FullCalendarProps, WeekSchedule } from "../types";
import { getWeekFromEnrollments } from "../utils";
import useColorScheme from "../hooks/useColorScheme";
import { getEnrollments } from "../services/enrollments";

export default function FullCalendar({ route }: FullCalendarProps) {
  const context = useContext(AppContext);
  const colorScheme = useColorScheme();

  const [weekRes, setWeekRes] = useState<{
    week: WeekSchedule;
    startCalendarHour: number;
    endCalendarHour: number;
  }>({ week: [], startCalendarHour: 8, endCalendarHour: 6 });
  const [refreshing, setRefreshing] = useState<boolean>(true);

  useEffect(() => {
    const loadScreen = async () => {
      if (route.params.id === context.user.id) {
        setWeekRes(getWeekFromEnrollments(context.enrollments));
      } else {
        setWeekRes(
          getWeekFromEnrollments(await getEnrollments(route.params.id))
        );
      }
      setRefreshing(false);
    };
    loadScreen();
  }, []);

  if (refreshing) return <ActivityIndicator />;

  return (
    <ScrollView
      contentContainerStyle={[
        AppStyles.section,
        { backgroundColor: Colors[colorScheme].background },
      ]}
      style={{ backgroundColor: Colors[colorScheme].background }}
    >
      <Calendar
        week={weekRes.week}
        startCalendarHour={weekRes.startCalendarHour}
        endCalendarHour={weekRes.endCalendarHour}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
