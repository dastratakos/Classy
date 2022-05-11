import * as Notifications from "expo-notifications";

import { Icon, Icon2, Text, View } from "../components/Themed";
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
} from "../utils";
import { getUser, updateUser } from "../services/users";
import { useContext, useEffect, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import Calendar from "../components/Calendar";
import Colors from "../constants/Colors";
import Constants from "expo-constants";
import { Enrollment, WeekSchedule } from "../types";
import EnrollmentList from "../components/Lists/EnrollmentList";
import Layout from "../constants/Layout";
import ProfilePhoto from "../components/ProfilePhoto";
import Separator from "../components/Separator";
import SquareButton from "../components/Buttons/SquareButton";
import TabView from "../components/TabView";
import { Timestamp } from "firebase/firestore";
import { auth } from "../firebase";
import { getEnrollmentsForTerm } from "../services/enrollments";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import { getFriendIds, getRequestIds } from "../services/friends";

export default function Profile() {
  const context = useContext(AppContext);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const [numFriends, setNumFriends] = useState<string>("");
  const [numRequests, setNumRequests] = useState<number>(0);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [week, setWeek] = useState<WeekSchedule>([]);
  const [refreshing, setRefreshing] = useState<boolean>(true);
  const [showEmailVerification, setShowEmailVerification] = useState<boolean>(
    !auth.currentUser?.emailVerified
  );
  const [inClass, setInClass] = useState(false);

  useEffect(() => {
    const loadScreen = async () => {
      // if (!context.user && auth.currentUser) getUser(auth.currentUser.uid);
      if (auth.currentUser) {
        const user = await getUser(auth.currentUser.uid);
        context.setUser({ ...context.user, ...user });
        getFriendIds(context.user.id).then((res) =>
          setNumFriends(`${res.length}`)
        );

        getRequestIds(context.user.id).then((res) =>
          setNumRequests(res.length)
        );

        const res = await getEnrollmentsForTerm(
          context.user.id,
          getCurrentTermId()
        );
        setEnrollments(res);
        setWeek(getWeekFromEnrollments(res));

        setInterval(checkInClass, 1000);
      }
    };
    loadScreen();

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setShowEmailVerification(!user.emailVerified);
    });

    setRefreshing(false);

    return unsubscribe;
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);

    const user = await getUser(context.user.id);
    context.setUser({ ...context.user, ...user });
    getFriendIds(context.user.id).then((res) => {
      setNumFriends(`${res.length}`);
    });

    const res = await getEnrollmentsForTerm(
      context.user.id,
      getCurrentTermId()
    );
    setEnrollments(res);
    setWeek(getWeekFromEnrollments(res));

    if (auth.currentUser)
      setShowEmailVerification(!auth.currentUser.emailVerified);
    console.log("emailVerified:", auth.currentUser?.emailVerified);

    checkInClass();

    setRefreshing(false);
  };

  const checkInClass = () => {
    const now = Timestamp.now().toDate();
    const today = now.getDay() - 1;

    if (!week[today]) {
      setInClass(false);
      return;
    }

    for (let event of week[today].events) {
      const startInfo = event.startInfo.toDate();
      var startTime = new Date();
      startTime.setHours(startInfo.getHours());
      startTime.setMinutes(startInfo.getMinutes());

      const endInfo = event.endInfo.toDate();
      var endTime = new Date();
      endTime.setHours(endInfo.getHours());
      endTime.setMinutes(endInfo.getMinutes());

      if (startTime <= now && endTime >= now) {
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
            Please verify your email to use Plan-It.
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
            <Icon name="close" size={Layout.icon.small} />
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
      component: <Calendar week={week} />,
    },
    {
      label: "Courses",
      component: <EnrollmentList enrollments={enrollments} />,
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
          <View style={[AppStyles.row, { flex: 1 }]}>
            <ProfilePhoto
              url={context.user.photoUrl}
              size={Layout.photo.large}
              style={{ marginRight: Layout.spacing.large }}
            />
            <View style={{ flexGrow: 1 }}>
              <Text style={styles.name}>{context.user.name}</Text>
              <View
                style={[
                  AppStyles.row,
                  { marginVertical: Layout.spacing.xsmall },
                ]}
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
        </View>
        <View style={[AppStyles.row, { marginVertical: 15 }]}>
          <View style={{ flex: 1, marginRight: Layout.spacing.small }}>
            {/* Major */}
            {context.user.major ? (
              <View style={AppStyles.row}>
                <View style={styles.iconWrapper}>
                  <Icon2 name="pencil" size={Layout.icon.small} />
                </View>
                <Text style={styles.aboutText}>{context.user.major}</Text>
              </View>
            ) : null}
            {/* Graduation Year */}
            {context.user.gradYear ? (
              <View style={AppStyles.row}>
                <View style={styles.iconWrapper}>
                  <Icon2 name="graduation" size={Layout.icon.small} />
                </View>
                <Text style={styles.aboutText}>{context.user.gradYear}</Text>
              </View>
            ) : null}
            {/* Interests */}
            {context.user.interests ? (
              <View style={AppStyles.row}>
                <View style={styles.iconWrapper}>
                  <Icon2 name="puzzle" size={Layout.icon.small} />
                </View>
                <Text style={styles.aboutText}>{context.user.interests}</Text>
              </View>
            ) : null}
          </View>
          <SquareButton
            num={`${numFriends}`}
            text={"friend" + (numFriends === "1" ? "" : "s")}
            size={Layout.buttonHeight.large}
            onPress={() => navigation.navigate("MyFriends")}
            indicator={numRequests > 0}
          />
        </View>
        <View style={[AppStyles.row]}>
          <Text style={styles.term}>
            {termIdToFullName(getCurrentTermId())}
          </Text>
          <Button
            text="View All Quarters"
            onPress={() =>
              navigation.navigate("Quarters", { user: context.user })
            }
          />
        </View>
      </View>
      <Separator />
      <View style={AppStyles.section}>
        <TabView tabs={tabs} selectedStyle={{ backgroundColor: Colors.pink }} />
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
