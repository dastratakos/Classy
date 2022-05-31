import * as Haptics from "expo-haptics";

import { Animated, FlatList, Image, StyleSheet } from "react-native";
import { generateTerms, updateUser } from "../services/users";
import { useContext, useRef, useState } from "react";

import AddProfileDetails from "../components/Onboarding/AddProfileDetails";
import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import OnboardingInfo from "../components/Onboarding/OnboardingInfo";
import Paginator from "../components/Paginator";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "../components/Themed";
import { generateSubstrings } from "../utils";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function Onboarding() {
  const navigation = useNavigation();
  const context = useContext(AppContext);
  const colorScheme = useColorScheme();

  const [photoUrl, setPhotoUrl] = useState(context.user.photoUrl);
  const [name, setName] = useState(context.user.name);
  const [startYear, setStartYear] = useState("2018"); // TODO: compute these values
  const [gradYear, setGradYear] = useState("2022");
  const [errorMessage, setErrorMessage] = useState("");

  const handleGetStarted = async () => {
    // if (name === "") {
    //   setErrorMessage("Please enter your name");
    //   return;
    // } else if (startYear > gradYear) {
    //   setErrorMessage("Start year cannot be after the end year");
    //   return;
    // }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const data = {
      name: name ? name : "",
      photoUrl: photoUrl ? photoUrl : "",
      keywords: generateSubstrings(name),
      startYear,
      gradYear,
      onboarded: true,
      terms: generateTerms(context.user.terms, startYear, gradYear),
    };

    updateUser(context.user.id, data);
    context.setUser({ ...context.user, ...data });

    navigation.reset({
      index: 0,
      routes: [{ name: "Root" }],
    });
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (currentIndex < screens.length - 1)
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
  };

  const screens = [
    {
      id: 0,
      component: (
        <AddProfileDetails
          photoUrl={photoUrl}
          setPhotoUrl={setPhotoUrl}
          name={name}
          setName={setName}
          startYear={startYear}
          setStartYear={setStartYear}
          gradYear={gradYear}
          setGradYear={setGradYear}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      ),
    },
    {
      id: 1,
      component: (
        <OnboardingInfo
          title="Plan classes"
          body="Add your classes to Classy and see your day at a glance."
          image={
            <Image
              source={require("../assets/images/onboarding/onboarding1.png")}
              style={styles.image}
            />
          }
        />
      ),
    },
    {
      id: 2,
      component: (
        <OnboardingInfo
          title="Take classes with friends"
          body="View your friends' daily schedules and their past, current, and
          future classes to help you plan your schedule."
          image={
            <Image
              source={require("../assets/images/onboarding/onboarding2.png")}
              style={styles.image}
            />
          }
        />
      ),
    },
    {
      id: 3,
      component: (
        <OnboardingInfo
          title="Search for any peer or class"
          body="Discover classes that your peers have taken, and meet students
          with similar classes or interests."
          image={
            <Image
              source={require("../assets/images/onboarding/onboarding3.png")}
              style={styles.image}
            />
          }
        />
      ),
    },
  ];

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}
    >
      <View style={{ flex: 4 }}>
        <FlatList
          data={screens}
          renderItem={({ item }) => item.component}
          pagingEnabled
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          scrollEventThrottle={32}
          ref={slidesRef}
        />
      </View>
      <View style={[AppStyles.section, { flex: 1 }]}>
        <Paginator data={screens} scrollX={scrollX} />
        <Button
          text={currentIndex < screens.length - 1 ? "Next" : "Get started"}
          onPress={
            currentIndex < screens.length - 1 ? scrollTo : handleGetStarted
          }
          emphasized
          wide
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    height: Layout.window.width,
    width: Layout.window.width,
    resizeMode: "contain",
  },
});
