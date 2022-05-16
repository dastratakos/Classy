import { ScrollView, StyleSheet } from "react-native";
import { useContext, useEffect, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import { FavoritedCourse } from "../types";
import { View } from "../components/Themed";
import { getFavorites } from "../services/courses";
import useColorScheme from "../hooks/useColorScheme";
import FavoriteCard from "../components/Cards/FavoriteCard";

export default function Favorites() {
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
        {favorites.map((favorite: FavoritedCourse, i: number) => (
          <FavoriteCard favorite={favorite} key={i.toString()} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
