import { ScrollView, StyleSheet } from "react-native";
import { View } from "../components/Themed";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import CourseList from "../components/CourseList";
import { db } from "../firebase";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function Favorites() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    getFavorites(context.user.id);
  }, []);

  const getFavorites = async (id: string) => {
    const q = query(collection(db, "favorites"), where("userId", "==", id));

    const results = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      results.push(doc.data());
    });
    setFavorites(results);
  };

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

const styles = StyleSheet.create();
