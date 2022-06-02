import * as Haptics from "expo-haptics";
import * as Notifications from "expo-notifications";

import { Degree, Enrollment, WeekSchedule } from "../types";
import { FontAwesome, SimpleLineIcons, Text, View } from "../components/Themed";
import {
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from "react-native";
import { User, sendEmailVerification } from "firebase/auth";
import {
  getCurrentTermId,
  getWeekFromEnrollments,
  termIdToFullName,
  termIdToQuarterName,
  timeIsEarlier,
} from "../utils";
import { updateUser } from "../services/users";
import { useContext, useEffect, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import Calendar from "../components/Calendar/Calendar";
import Colors from "../constants/Colors";
import Constants from "expo-constants";
import EmptyList from "../components/EmptyList";
import EnrollmentList from "../components/Lists/EnrollmentList";
import Layout from "../constants/Layout";
import ProfilePhoto from "../components/ProfilePhoto";
import SVGAutumn from "../assets/images/undraw/autumn.svg";
import SVGNoCourses from "../assets/images/undraw/noCourses.svg";
import SVGSpring from "../assets/images/undraw/spring.svg";
import SVGSummer from "../assets/images/undraw/summer.svg";
import SVGWinter from "../assets/images/undraw/winter.svg";
import Separator from "../components/Separator";
import SquareButton from "../components/Buttons/SquareButton";
import TabView from "../components/TabView";
import { Timestamp } from "firebase/firestore";
import { auth } from "../firebase";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function Profile() {
  const context = useContext(AppContext);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const currentEnrollments = context.enrollments.filter(
    (enrollment: Enrollment) => enrollment.termId === getCurrentTermId()
  );
  const quarterName = termIdToQuarterName(getCurrentTermId());

  const [weekRes, setWeekRes] = useState<{
    week: WeekSchedule;
    startCalendarHour: number;
    endCalendarHour: number;
  }>({ week: [], startCalendarHour: 8, endCalendarHour: 6 });
  const [refreshing, setRefreshing] = useState<boolean>(true);

  const [showEmailVerification, setShowEmailVerification] = useState<boolean>(
    !auth.currentUser?.emailVerified
  );
  const [inClass, setInClass] = useState(false);

  useEffect(() => {
    const loadScreen = async () => {
      setWeekRes(getWeekFromEnrollments(currentEnrollments));
    };
    loadScreen();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setShowEmailVerification(!user.emailVerified);
    });

    setRefreshing(false);

    return unsubscribe;
  }, []);

  useEffect(() => {
    const interval = setInterval(checkInClass, 1000);
    return () => clearInterval(interval);
  }, [weekRes]);

  const onRefresh = async () => {
    setRefreshing(true);

    if (auth.currentUser)
      setShowEmailVerification(!auth.currentUser.emailVerified);
    console.log("emailVerified:", auth.currentUser?.emailVerified);

    setRefreshing(false);
  };

  const checkInClass = () => {
    const now = Timestamp.now();
    const today = now.toDate().getDay() - 1;

    if (!weekRes.week[today]) {
      setInClass(false);
      return;
    }

    for (let event of weekRes.week[today].events) {
      if (!event.startInfo) continue;
      if (!event.endInfo) continue;
      if (
        timeIsEarlier(event.startInfo, now) &&
        timeIsEarlier(now, event.endInfo)
      ) {
        setInClass(true);
        return;
      }
    }
    setInClass(false);
  };

  const showSendVerificationEmail = () => {
    return (
      <>
        <View style={AppStyles.section}>
          <Text
            style={{ textAlign: "center", marginBottom: Layout.spacing.medium }}
          >
            Please verify your email to use Classy.
          </Text>
          <Button
            text="Resend Verification Email"
            onPress={() =>
              sendEmailVerification(auth.currentUser || ({} as User))
            }
          />
          <Pressable
            onPress={() => setShowEmailVerification(false)}
            style={({ pressed }) => [
              styles.closeButton,
              {
                opacity: pressed ? 0.5 : 1,
                borderColor: Colors[colorScheme].text,
              },
            ]}
          >
            <FontAwesome name="close" size={Layout.icon.small} />
          </Pressable>
        </View>
        <Separator />
      </>
    );
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then((expoPushToken) => {
      if (expoPushToken) {
        context.setUser({ ...context.user, expoPushToken });
        updateUser(context.user.id, { expoPushToken });
      }
    });
  }, []);

  const registerForPushNotificationsAsync = async () => {
    let expoPushToken;
    if (Constants.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      expoPushToken = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(expoPushToken);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return expoPushToken;
  };

  const tabs = [
    {
      label: "Calendar",
      component: (
        <Calendar
          week={weekRes.week}
          startCalendarHour={weekRes.startCalendarHour}
          endCalendarHour={weekRes.endCalendarHour}
        />
      ),
    },
    {
      label: "Courses",
      component: (
        <EnrollmentList
          enrollments={currentEnrollments}
          emptyElement={
            <EmptyList
              SVGElement={
                quarterName === "Aut"
                  ? SVGAutumn
                  : quarterName === "Win"
                  ? SVGWinter
                  : quarterName === "Spr"
                  ? SVGSpring
                  : quarterName === "Sum"
                  ? SVGSummer
                  : SVGNoCourses
              }
              primaryText="No courses this quarter"
              secondaryText="Add some from the search tab, or explore your friends' courses!"
            />
          }
        />
      ),
    },
  ];

  return (
    <ScrollView
      style={{ backgroundColor: Colors[colorScheme].background }}
      contentContainerStyle={{ alignItems: "center" }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* TODO: this needs to refresh to go away if we are verified */}
      {/* {showEmailVerification && showSendVerificationEmail()} */}
      <View style={AppStyles.section}>
        <View style={AppStyles.row}>
          <ProfilePhoto
            url={context.user.photoUrl}
            size={Layout.photo.large}
            style={{ marginRight: Layout.spacing.large }}
            withModal
          />
          <View style={{ width: "100%", flexShrink: 1 }}>
            <Text style={styles.name}>{context.user.name}</Text>
            <View
              style={[AppStyles.row, { marginVertical: Layout.spacing.xsmall }]}
            >
              <View
                style={[
                  styles.status,
                  inClass ? styles.inClass : styles.notInClass,
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: Colors[colorScheme].secondaryText },
                ]}
              >
                {inClass ? "In class" : "Not in class"}
              </Text>
            </View>
            <Button
              text="Edit Profile"
              onPress={() => navigation.navigate("Settings")}
              wide
            />
          </View>
        </View>
        <View style={[AppStyles.row, { marginVertical: 15 }]}>
          <View style={{ flex: 1, marginRight: Layout.spacing.small }}>
            {/* Degrees */}
            {context.user.degrees ? (
              <View style={[AppStyles.row, { justifyContent: "center" }]}>
                <View style={styles.iconWrapper}>
                  <SimpleLineIcons name="pencil" size={Layout.icon.small} />
                </View>
                <View style={styles.aboutText}>
                  {context.user.degrees.map((d: Degree, i: number) => (
                    <Text style={styles.aboutText} key={i}>
                      {d.major}
                      {d.degree ? ` (${d.degree})` : ""}
                    </Text>
                  ))}
                </View>
              </View>
            ) : null}
            {/* Graduation Year */}
            {context.user.gradYear ? (
              <View style={AppStyles.row}>
                <View style={styles.iconWrapper}>
                  <SimpleLineIcons name="graduation" size={Layout.icon.small} />
                </View>
                <Text style={styles.aboutText}>{context.user.gradYear}</Text>
              </View>
            ) : null}
            {/* Interests */}
            {context.user.interests ? (
              <View style={AppStyles.row}>
                <View style={styles.iconWrapper}>
                  <SimpleLineIcons name="puzzle" size={Layout.icon.small} />
                </View>
                <Text style={styles.aboutText}>{context.user.interests}</Text>
              </View>
            ) : null}
          </View>
          <SquareButton
            num={`${context.friendIds.length}`}
            text={"friend" + (context.friendIds.length === 1 ? "" : "s")}
            size={Layout.buttonHeight.large}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              navigation.navigate("Friends", { id: context.user.id });
            }}
          />
        </View>
        <View style={[AppStyles.row]}>
          <Text style={styles.term}>
            {termIdToFullName(getCurrentTermId())}
          </Text>
          <Button
            text="View All Quarters"
            onPress={() =>
              navigation.navigate("Quarters", {
                user: context.user,
                enrollments: context.enrollments,
              })
            }
          />
        </View>
      </View>
      <Separator />
      <View style={AppStyles.section}>
        <TabView
          tabs={tabs}
          selectedStyle={{ backgroundColor: Colors.pink }}
          initialSelectedId={0}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: Layout.text.xlarge,
  },
  status: {
    height: 10,
    width: 10,
    borderRadius: 10 / 2,
  },
  inClass: {
    backgroundColor: Colors.status.inClass,
  },
  notInClass: {
    backgroundColor: Colors.status.notInClass,
  },
  statusText: {
    marginLeft: Layout.spacing.small,
    flex: 1,
  },
  aboutText: {
    flex: 1,
  },
  iconWrapper: {
    width: 30,
    marginRight: 15,
    alignItems: "center",
    marginBottom: Layout.spacing.xsmall,
  },
  closeButton: {
    position: "absolute",
    top: Layout.spacing.small,
    right: Layout.spacing.medium,
  },
  term: {
    fontSize: Layout.text.large,
    fontWeight: "500",
  },
});
