import * as Haptics from "expo-haptics";

import { ScrollView, StyleSheet, TouchableOpacity, SectionList, Pressable } from "react-native";
import { Text, View } from "../components/Themed";
import { useContext } from "react";

import AppContext from "../context/Context";
import Colors, { enrollmentColors } from "../constants/Colors";
import Layout from "../constants/Layout";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import AppStyles from "../styles/AppStyles";
import NotificationCard from "../components/Cards/NotificationCard";
import { Icon2 } from "../components/Themed";

export default function Notifications() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  // Dummy data
  const DATA = [
    {
      title: "New",
      data: [
        {
          text: "Grace Alwan sent you a friend request.",
          time: "2h",
          photoUrl: "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/6K90G2P5LbT54j29CShLJC0IqdO2%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
        },
        {
          text: "Tara Jones accepted your friend request.", 
          time: "3h",
          photoUrl: "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/6K90G2P5LbT54j29CShLJC0IqdO2%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
        },
        {
          text: "Jess Yeung just enrolled in CS 221 for 2019-2020 Autumn.",
          time: "4h",
          photoUrl: "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/6K90G2P5LbT54j29CShLJC0IqdO2%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
        }
      ]
    },
    {
      title: "Earlier",
      data: [
        {
          text: "Add courses to your current quarter by searching by course code or name.",
          time: "1d",
          photoUrl: "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/6K90G2P5LbT54j29CShLJC0IqdO2%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
        },
        {
          text: "Reminder to input your class times for 2022-2023 Autumn!",
          time: "3d",
          photoUrl: "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/6K90G2P5LbT54j29CShLJC0IqdO2%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
        },
        {
          text: "Dean Stratakos accepted your friend request.",
          time: "1w",
          photoUrl: "https://firebasestorage.googleapis.com/v0/b/cs194w-team4.appspot.com/o/6K90G2P5LbT54j29CShLJC0IqdO2%2FprofilePhoto.jpg?alt=media&token=b6c8dda2-80a2-48ec-b9ad-0feadb38e1c8",
        }
      ]
    },
  ];

  return (
    <View style={styles.section}>
      <SectionList
        sections={DATA}
        keyExtractor={(item, index) => item.text + index}
        renderItem={({ item }) => (
          <NotificationCard 
            text={item.text}
            time={item.time}
            photoUrl={item.photoUrl} 
            rightElement={
              <View style={styles.acceptRejectContainer}>
                <Pressable onPress={() => console.log("Accept")}>
                  <Icon2
                    name="check"
                    size={Layout.icon.large}
                    lightColor={Colors[colorScheme].tint}
                    darkColor={Colors[colorScheme].tint}
                  />
                </Pressable>
                <Pressable onPress={() => console.log("Decline")}>
                  <Icon2 name="close" size={Layout.icon.large} />
                </Pressable>
              </View>
            }
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeaderContainer}>
            <Text style={styles.sectionHeader}>{title}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: "100%",
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",    
    marginTop: 20,
    marginBottom: 5,
    paddingTop: Layout.spacing.medium,
    paddingLeft: Layout.spacing.medium,
  },
  sectionHeaderContainer: {
    borderBottomColor: "#c4c4c4",
    borderBottomWidth: 1,
  },
  acceptRejectContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: Layout.photo.small,
    width: Layout.photo.medium,
    borderRadius: Layout.radius.xsmall,
    marginLeft: Layout.spacing.small,
    backgroundColor: "transparent",
  },
});
