import { Animated, FlatList, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import Colors from "../constants/Colors";
import CourseList from "../components/CourseList";
import Layout from "../constants/Layout";
import { db } from "../firebase";
import { getCurrentTermId, termIdToFullName } from "../utils";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import { SafeAreaView } from "react-native-safe-area-context";
import Paginator from "../components/Paginator";

export default function Onboarding() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

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

  const AddProfileDetails = () => {
    return (
      <View style={styles.screenContainer}>
        <Text>Add profile details</Text>
      </View>
    );
  };

  const PlanClasses = () => {
    return (
      <View style={styles.screenContainer}>
        <Text>Plan classes</Text>
      </View>
    );
  };

  const TakeClasses = () => {
    return (
      <View style={styles.screenContainer}>
        <Text>Take classes with friends</Text>
      </View>
    );
  };

  const SearchForPeerOrClass = () => {
    return (
      <View style={styles.screenContainer}>
        <Text>Search for any peer or class</Text>
      </View>
    );
  };

  const screens = [
    {
      id: 0,
      component: <AddProfileDetails />,
    },
    {
      id: 1,
      component: <PlanClasses />,
    },
    {
      id: 2,
      component: <TakeClasses />,
    },
    {
      id: 3,
      component: <SearchForPeerOrClass />,
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
      <View
        style={[AppStyles.section, { flex: 1, backgroundColor: "lightgreen" }]}
      >
        <Paginator data={screens} scrollX={scrollX} />
        <Button
          text={currentIndex < screens.length - 1 ? "Next" : "Get started"}
          onPress={scrollTo}
          emphasized
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    width: Layout.window.width,
    backgroundColor: "pink",
  },
  title: {
    marginTop: Layout.spacing.xlarge,
    fontSize: Layout.text.xlarge,
  },
});
