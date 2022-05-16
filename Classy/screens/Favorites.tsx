import { ActivityIndicator, View } from "../components/Themed";
import { ScrollView, StyleSheet } from "react-native";
import { useContext, useEffect, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import EmptyList from "../components/EmptyList";
import FavoriteCard from "../components/Cards/FavoriteCard";
import { FavoritedCourse } from "../types";
import SVGImagination from "../assets/images/undraw/imagination.svg";
import { getFavorites } from "../services/courses";
import useColorScheme from "../hooks/useColorScheme";

export default function Favorites() {
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  const [favorites, setFavorites] = useState<FavoritedCourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadScreen = async () => {
      setFavorites(await getFavorites(context.user.id));
      setLoading(false);
    };
    loadScreen();
  }, []);

  if (loading) return <ActivityIndicator />;

  return (
    <ScrollView
      style={{ backgroundColor: Colors[colorScheme].background }}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={AppStyles.section}>
        {favorites.length > 0 ? (
          <>
            {favorites.map((favorite: FavoritedCourse, i: number) => (
              <FavoriteCard favorite={favorite} key={i.toString()} />
            ))}
          </>
        ) : (
          <EmptyList
            SVGElement={SVGImagination}
            primaryText="No favorites"
            secondaryText={
              "Press the ☆ icon on a course\ndetails page to favorite it!"
            }
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
