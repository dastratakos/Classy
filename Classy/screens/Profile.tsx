import * as Notifications from "expo-notifications";

import { Icon, Text, View } from "../components/Themed";
import {
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from "react-native";
import { User, sendEmailVerification } from "firebase/auth";
import { getCurrentTermId, termIdToFullName } from "../utils";
import { getUser, updateUser } from "../services/users";
import { useContext, useEffect, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import Calendar from "../components/Calendar";
import Colors from "../constants/Colors";
import Constants from "expo-constants";
import { Enrollment } from "../types";
import EnrollmentList from "../components/EnrollmentList";
import Layout from "../constants/Layout";
import ProfilePhoto from "../components/ProfilePhoto";
import Separator from "../components/Separator";
import SquareButton from "../components/Buttons/SquareButton";
import TabView from "../components/TabView";
import { Timestamp } from "firebase/firestore";
import { auth } from "../firebase";
import events from "./dummyEvents";
import { getEnrollmentsForTerm } from "../services/enrollments";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function Profile() {
  const context = useContext(AppContext);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const [enrollments, setEnrollments] = useState([] as Enrollment[]);
  const [refreshing, setRefreshing] = useState(true);
  const [showEmailVerification, setShowEmailVerification] = useState(
    !auth.currentUser?.emailVerified
  );
  const [inClass, setInClass] = useState(false);

  useEffect(() => {
    const loadScreen = async () => {
      // if (!context.user && auth.currentUser) getUser(auth.currentUser.uid);
      if (auth.currentUser) {
        const user = await getUser(auth.currentUser.uid);
        context.setUser({ ...context.user, ...user });

        getEnrollmentsForTerm(context.user.id, getCurrentTermId()).then(() =>
          setInterval(checkInClass, 1000)
        );
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
    setEnrollments(
      await getEnrollmentsForTerm(context.user.id, getCurrentTermId())
    );
    if (auth.currentUser)
      setShowEmailVerification(!auth.currentUser.emailVerified);
    console.log("emailVerified:", auth.currentUser?.emailVerified);
    checkInClass();
    setRefreshing(false);
  };

  const checkInClass = () => {
    const now = Timestamp.now().toDate();
    const today = now.getDay() - 1;

    if (!events[today]) {
      setInClass(false);
      return;
    }

    for (let event of events[today].events) {
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
      component: <Calendar events={events} />,
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
      {showEmailVerification && showSendVerificationEmail()}
      <View style={AppStyles.section}>
        <View style={AppStyles.row}>
          <View style={[AppStyles.row, { flex: 1 }]}>
            <ProfilePhoto
              url={context.user.photoUrl}
              size={Layout.photo.medium}
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
                  <Icon name="pencil" size={Layout.icon.medium} />
                </View>
                <Text style={styles.aboutText}>{context.user.major}</Text>
              </View>
            ) : null}
            {/* Graduation Year */}
            {context.user.gradYear ? (
              <View style={AppStyles.row}>
                <View style={styles.iconWrapper}>
                  <Icon name="graduation-cap" size={Layout.icon.medium} />
                </View>
                <Text style={styles.aboutText}>{context.user.gradYear}</Text>
              </View>
            ) : null}
            {/* Interests */}
            {context.user.interests ? (
              <View style={AppStyles.row}>
                <View style={styles.iconWrapper}>
                  <Icon name="puzzle-piece" size={Layout.icon.medium} />
                </View>
                <Text style={styles.aboutText}>{context.user.interests}</Text>
              </View>
            ) : null}
          </View>
          <SquareButton
            num={`${context.friendIds.length}`}
            text={"friend" + (context.friendIds.length === 1 ? "" : "s")}
            size={Layout.buttonHeight.large}
            onPress={() => navigation.navigate("MyFriends")}
          />
        </View>
        <View style={[AppStyles.row, { marginBottom: Layout.spacing.medium }]}>
          <Text style={styles.term}>
            {termIdToFullName(getCurrentTermId())}
          </Text>
          <Button
            text="View All"
            onPress={() => navigation.navigate("MyQuarters")}
          />
        </View>
      </View>
      <Separator />
      <View style={AppStyles.section}>
        <TabView tabs={tabs} />
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
  },
  closeButton: {
    position: "absolute",
    top: Layout.spacing.small,
    right: Layout.spacing.medium,
  },
  term: {
    fontSize: Layout.text.large,
  },
});
