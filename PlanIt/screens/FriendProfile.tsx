import { Pressable, ScrollView, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";

import Button from "../components/Buttons/Button";
import Colors from "../constants/Colors";
import CourseCard from "../components/CourseCard";
import { FontAwesome } from "@expo/vector-icons";
import Layout from "../constants/Layout";
import SquareButton from "../components/Buttons/SquareButton";
import { useNavigation } from "@react-navigation/core";

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

export default function Profile() {
  const navigation = useNavigation();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={styles.section}>
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <View style={styles.row}>
            <View style={styles.photo}></View>
            <View>
              <Text style={styles.name}>{profile.name}</Text>
              <View
                style={[styles.row, { marginVertical: Layout.spacing.xsmall }]}
              >
                <View
                  style={[
                    styles.status,
                    profile.inClass ? styles.inClass : styles.notInClass,
                  ]}
                ></View>
                <Text style={styles.statusText}>
                  {profile.inClass ? "In class" : "Not in class"}
                </Text>
              </View>
              <View style={styles.row}>
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
                  <FontAwesome
                    name="ellipsis-h"
                    size={25}
                    color={Colors.light.text}
                  />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
        <View
          style={[
            styles.row,
            { justifyContent: "space-between", marginTop: 15 },
          ]}
        >
          <View>
            {/* Major */}
            <View style={styles.row}>
              <View style={styles.iconWrapper}>
                <FontAwesome
                  name="pencil"
                  size={25}
                  color={Colors.light.text}
                />
              </View>
              <Text>{profile.major}</Text>
            </View>
            {/* Graduation Year */}
            <View style={styles.row}>
              <View style={styles.iconWrapper}>
                <FontAwesome
                  name="graduation-cap"
                  size={25}
                  color={Colors.light.text}
                />
              </View>
              <Text>{profile.gradYear}</Text>
            </View>
          </View>
          <SquareButton
            num={profile.numFriends}
            text="friends"
            onPress={() => navigation.navigate("Friends")}
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
            ]}
          >
            <View
              style={[
                StyleSheet.absoluteFill,
                styles.similarityBar,
                { width: `${profile.courseSimilarity}%` },
              ]}
            />
            <Text style={styles.similarityText}>
              {Math.round(profile.courseSimilarity)}% course similarity
            </Text>
          </Pressable>
        )}
      </View>
      <View
        style={styles.separator}
        lightColor="#ccc"
        darkColor="rgba(255,255,255,0.1)"
      />
      {profile.private && !profile.friends ? (
        <View
          style={{ alignItems: "center", marginTop: Layout.spacing.xxlarge }}
        >
          <FontAwesome name="lock" size={100} color={Colors.light.text} />
          <Text>This user is private</Text>
        </View>
      ) : (
        <>
          <View style={styles.section}>
            {profile.courses.map((course, i) => (
              <CourseCard
                code={course.code}
                title={course.title}
                units={course.units}
                numFriends={course.numFriends}
                emphasize={course.taking}
              />
            ))}
          </View>
          <View
            style={styles.separator}
            lightColor="#ccc"
            darkColor="rgba(255,255,255,0.1)"
          />
          <View style={styles.section}>
            <Text style={{ alignSelf: "center" }}>TODO: Calendar view</Text>
            {/* <View style={[styles.row, { justifyContent: "space-between" }]}>
         <View style={styles.day}>
           <Text>M</Text>
         </View>
         <View style={styles.day}>
           <Text>T</Text>
         </View>
         <View style={styles.day}>
           <Text>W</Text>
         </View>
         <View style={styles.day}>
           <Text>T</Text>
         </View>
         <View style={[styles.day, styles.daySelected]}>
           <Text style={styles.daySelected}>F</Text>
         </View>
       </View> */}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
  },
  section: {
    width: "100%",
    padding: Layout.spacing.medium,
  },
  photo: {
    backgroundColor: Colors.imagePlaceholder,
    height: Layout.image.medium,
    width: Layout.image.medium,
    borderRadius: Layout.image.medium / 2,
    marginRight: Layout.spacing.large,
  },
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
    color: Colors.light.secondaryText,
    marginLeft: Layout.spacing.small,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  ellipsis: {
    marginLeft: Layout.spacing.small,
    height: 25,
    width: 25,
    borderRadius: 25 / 2,
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
    paddingVertical: Layout.spacing.xxsmall,
    marginTop: Layout.spacing.medium,
  },
  similarityBar: {
    backgroundColor: Colors.imagePlaceholder,
    borderRadius: Layout.radius.small,
  },
  similarityText: {
    alignSelf: "center",
  },
  separator: {
    marginVertical: 10,
    height: 2,
    borderRadius: 1,
    width: "80%",
  },
  day: {
    alignItems: "center",
    justifyContent: "center",
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
    borderWidth: 1,
  },
  daySelected: {
    color: "#fff",
    backgroundColor: "red",
  },
});
