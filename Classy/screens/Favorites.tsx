import { ScrollView, StyleSheet } from "react-native";
import { useContext, useEffect, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import CourseList from "../components/CourseList";
import { FavoritedCourse } from "../types";
import { View } from "../components/Themed";
import { getFavorites } from "../services/courses";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function Favorites() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  const [favorites, setFavorites] = useState<FavoritedCourse[]>([]);

  useEffect(() => {
    const loadScreen = async () => {
      setFavorites(await getFavorites(context.user.id));
    };
    loadScreen();
  }, []);

  return (
    <ScrollView
      style={{ backgroundColor: Colors[colorScheme].background }}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={AppStyles.section}>
        <CourseList courses={favorites} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
