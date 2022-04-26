import { Icon, Text, View } from "../components/Themed";
import {
  Pressable,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from "react-native";
import { User, sendEmailVerification } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import Calendar from "../components/Calendar";
import Colors from "../constants/Colors";
import { Course } from "../types";
import Layout from "../constants/Layout";
import Separator from "../components/Separator";
import SquareButton from "../components/Buttons/SquareButton";
import WideButton from "../components/Buttons/WideButton";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function Profile() {
  const context = useContext(AppContext);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const [courses, setCourses] = useState([] as Course[]);
  const [refreshing, setRefreshing] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(
    !auth.currentUser?.emailVerified
  );

  useEffect(() => {
    // if (!context.user && auth.currentUser) getUser(auth.currentUser.uid);

    if (auth.currentUser) {
      getUser(auth.currentUser.uid);
      getCourses(context.user.id);
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setShowEmailVerification(!user.emailVerified);
    });

    return unsubscribe;
  }, []);

  const getUser = async (id: string) => {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      context.setUser({ ...context.user, ...docSnap.data() });
    } else {
      console.log(`Could not find user: ${id}`);
    }
  };

  const getCourses = async (id: string) => {
    // TODO: use id to query for specific courses
    const q = query(collection(db, "courses"));

    const results = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      results.push(doc.data());
    });
    setCourses(results);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getUser(context.user.id);
    await getCourses(context.user.id);
    if (auth.currentUser)
      setShowEmailVerification(!auth.currentUser.emailVerified);
    console.log("emailVerified:", auth.currentUser?.emailVerified);
    setRefreshing(false);
  };

  // TODO: calculate inClass
  const inClass = true;

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
            <Icon name="close" size={20} />
          </Pressable>
        </View>
        <Separator />
      </>
    );
  };

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
          <View style={AppStyles.row}>
            {context.user.photoUrl ? (
              <Image
                source={{ uri: context.user.photoUrl }}
                style={[
                  AppStyles.photoMedium,
                  { marginRight: Layout.spacing.large },
                ]}
              />
            ) : (
              <View
                style={[
                  AppStyles.photoMedium,
                  {
                    marginRight: Layout.spacing.large,
                    backgroundColor: Colors[colorScheme].imagePlaceholder,
                  },
                ]}
              />
            )}
            <View>
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
            </View>
          </View>
        </View>
        <View style={[AppStyles.row, { marginVertical: 15 }]}>
          <View style={{ flex: 1, marginRight: Layout.spacing.small }}>
            {/* Major */}
            {context.user.major ? (
              <View style={AppStyles.row}>
                <View style={styles.iconWrapper}>
                  <Icon name="pencil" size={25} />
                </View>
                <Text style={styles.aboutText}>{context.user.major}</Text>
              </View>
            ) : null}
            {/* Graduation Year */}
            {context.user.gradYear ? (
              <View style={AppStyles.row}>
                <View style={styles.iconWrapper}>
                  <Icon name="graduation-cap" size={25} />
                </View>
                <Text style={styles.aboutText}>{context.user.gradYear}</Text>
              </View>
            ) : null}
            {/* Interests */}
            {context.user.interests ? (
              <View style={AppStyles.row}>
                <View style={styles.iconWrapper}>
                  <Icon name="puzzle-piece" size={25} />
                </View>
                <Text style={styles.aboutText}>{context.user.interests}</Text>
              </View>
            ) : null}
          </View>
          <SquareButton
            num={`${context.friendIds.length}`}
            text={"friend" + (context.friendIds.length === 1 ? "" : "s")}
            onPress={() =>
              navigation.navigate("Friends", { id: context.user.id })
            }
          />
        </View>
        <WideButton
          text={"View Courses"}
          onPress={() => navigation.navigate("Courses")}
        />
      </View>
      <Separator />
      <View style={AppStyles.section}>
        <Calendar courses={courses} />
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
});
