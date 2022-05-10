import { Animated, FlatList, Image, StyleSheet } from "react-native";
import { View } from "../components/Themed";
import { useContext, useRef, useState } from "react";

import AddProfileDetails from "../components/Onboarding/AddProfileDetails";
import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import Colors from "../constants/Colors";
import Paginator from "../components/Paginator";
import { SafeAreaView } from "react-native-safe-area-context";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import { generateSubstrings } from "../utils";
import OnboardingInfo from "../components/Onboarding/OnboardingInfo";
import Layout from "../constants/Layout";
import { updateUser } from "../services/users";

export default function Onboarding() {
  const navigation = useNavigation();
  const context = useContext(AppContext);
  const colorScheme = useColorScheme();

  const [photoUrl, setPhotoUrl] = useState(context.user.photoUrl);
  const [name, setName] = useState(context.user.name);
  const [major, setMajor] = useState(context.user.major);
  const [startYear, setStartYear] = useState(2018); // TODO: compute these values
  const [endYear, setEndYear] = useState(2022);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGetStarted = async () => {
    if (name === "") {
      setErrorMessage("Please enter your name");
      return;
    } else if (startYear > endYear) {
      setErrorMessage("Start year cannot be after the end year");
      return;
    }

    const data = {
      name,
      major,
      photoUrl,
      keywords: generateSubstrings(name),
      gradYear: endYear,
      onboarded: true,
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
    if (currentIndex < screens.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      console.log("Last item");
    }
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
          major={major}
          setMajor={setMajor}
          startYear={startYear}
          setStartYear={setStartYear}
          endYear={endYear}
          setEndYear={setEndYear}
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
      <View style={{ flex: 3 }}>
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
