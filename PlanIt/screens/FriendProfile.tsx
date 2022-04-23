import { Pressable, ScrollView, StyleSheet } from "react-native";
import { Icon, Text, View } from "../components/Themed";

import Button from "../components/Buttons/Button";
import Colors from "../constants/Colors";
import CourseCard from "../components/CourseCard";
import Layout from "../constants/Layout";
import SquareButton from "../components/Buttons/SquareButton";
import { useNavigation } from "@react-navigation/core";
import useColorScheme from "../hooks/useColorScheme";
import Calendar from "../components/Calendar";
import AppStyles from "../styles/AppStyles";
import Separator from "../components/Separator";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { FriendProfileProps, User } from "../types";

const profile = {
  name: "Jiwon Lee",
  inClass: false,
  major: "Computer Science",
  gradYear: "2022 (Senior)",
  numFriends: "102",
  // courseSimilarity: 57.54,
  courseSimilarity: 83,
  friends: true,
  private: true,
  courses: [
    {
      code: "CS 194W",
      title: "Senior Project (WIM)",
      units: "3",
      numFriends: "12",
      taking: true,
    },
    {
      code: "CS 221",
      title: "Artificial Intelligence",
      units: "3-4",
      numFriends: "8",
      taking: false,
    },
    {
      code: "ECON 1",
      title: "Principles of Economics",
      units: "5",
      numFriends: "8",
      taking: false,
    },
    {
      code: "PSYC 135",
      title: "Dement's Sleep and Dreams",
      units: "3",
      numFriends: "21",
      taking: false,
    },
  ],
};

export default function FriendProfile({ route }: FriendProfileProps) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const [user, setUser] = useState({} as User);

  useEffect(() => {
    const getUser = async (id: string) => {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUser(docSnap.data() as User);
      } else {
        console.log(`Could not find user: ${id}`);
        alert("This account does not exist.");
      }
    };

    getUser(route.params.id);
  }, []);

  return (
    <ScrollView
      style={{ backgroundColor: Colors[colorScheme].background }}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={AppStyles.section}>
        <View style={[AppStyles.row, { justifyContent: "space-between" }]}>
          <View style={AppStyles.row}>
            <View
              style={[
                AppStyles.photoMedium,
                {
                  marginRight: Layout.spacing.large,
                  backgroundColor: Colors[colorScheme].imagePlaceholder,
                },
              ]}
            ></View>
            <View>
              <Text style={styles.name}>{user.name}</Text>
              <View
                style={[styles.row, { marginVertical: Layout.spacing.xsmall }]}
              >
                <View
                  style={[
                    styles.status,
                    profile.inClass ? styles.inClass : styles.notInClass,
                  ]}
                ></View>
                <Text
                  style={[
                    styles.statusText,
                    { color: Colors[colorScheme].secondaryText },
                  ]}
                >
                  {profile.inClass ? "In class" : "Not in class"}
                </Text>
              </View>
              <View style={AppStyles.row}>
                {profile.friends ? null : (
                  <View style={{ marginRight: Layout.spacing.small }}>
                    <Button
                      text="Add Friend"
                      onPress={() => console.log("Add Friend pressed")}
                    />
                  </View>
                )}
                <Button
                  text="Message"
                  onPress={() => {
                    console.log("Message pressed");
                    navigation.navigate("Messages");
                  }}
                />
                <Pressable
                  onPress={() => console.log("Ellipsis pressed")}
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.5 : 1,
                    },
                    styles.ellipsis,
                  ]}
                >
                  <Icon name="ellipsis-h" size={25} />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
        <View
          style={[
            AppStyles.row,
            { justifyContent: "space-between", marginTop: 15 },
          ]}
        >
          <View>
            {/* Major */}
            <View style={styles.row}>
              <View style={styles.iconWrapper}>
                <Icon name="pencil" size={25} />
              </View>
              <Text>{user.major}</Text>
            </View>
            {/* Graduation Year */}
            <View style={styles.row}>
              <View style={styles.iconWrapper}>
                <Icon name="graduation-cap" size={25} />
              </View>
              <Text>{user.gradYear}</Text>
            </View>
          </View>
          <SquareButton
            num={profile.numFriends}
            text="friends"
            onPress={() =>
              navigation.navigate("Friends", { id: route.params.id })
            }
          />
        </View>
        {profile.private && !profile.friends ? null : (
          <Pressable
            onPress={() => console.log("Course similarity pressed")}
            style={({ pressed }) => [
              {
                opacity: pressed ? 0.5 : 1,
              },
              styles.similarityContainer,
              { borderColor: Colors[colorScheme].text },
            ]}
          >
            <View
              style={[
                StyleSheet.absoluteFill,
                styles.similarityBar,
                {
                  backgroundColor: Colors[colorScheme].imagePlaceholder,
                  width: `${profile.courseSimilarity}%`,
                },
              ]}
            />
            <Text style={styles.similarityText}>
              {Math.round(profile.courseSimilarity)}% course similarity
            </Text>
          </Pressable>
        )}
      </View>
      <Separator />
      {profile.private && !profile.friends ? (
        <View
          style={{ alignItems: "center", marginTop: Layout.spacing.xxlarge }}
        >
          <Icon name="lock" size={100} />
          <Text>This user is private</Text>
        </View>
      ) : (
        <>
          <View style={AppStyles.section}>
            {profile.courses.map((course, i) => (
              <CourseCard
                code={course.code}
                title={course.title}
                units={course.units}
                numFriends={course.numFriends}
                emphasize={course.taking}
                key={i}
              />
            ))}
          </View>
          <Separator />
          <View style={AppStyles.section}>
            <Calendar />
          </View>
        </>
      )}
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
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  ellipsis: {
    marginLeft: Layout.spacing.small,
    height: 40,
    width: 40,
    borderRadius: 40 / 2,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    width: 30,
    marginRight: 15,
    alignItems: "center",
  },
  similarityContainer: {
    borderWidth: 1,
    borderRadius: Layout.radius.small,
    paddingVertical: Layout.spacing.small,
    marginTop: Layout.spacing.medium,
  },
  similarityBar: {
    borderRadius: Layout.radius.small,
  },
  similarityText: {
    alignSelf: "center",
  },
});
