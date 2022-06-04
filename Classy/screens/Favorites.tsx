import { FlatList, StyleSheet } from "react-native";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Colors from "../constants/Colors";
import EmptyList from "../components/EmptyList";
import FavoriteCard from "../components/Cards/FavoriteCard";
import SVGImagination from "../assets/images/undraw/imagination.svg";
import useColorScheme from "../hooks/useColorScheme";
import { useContext } from "react";

export default function Favorites() {
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  return (
    <FlatList
      data={context.favorites}
      keyExtractor={(item) => item.courseId.toString()}
      renderItem={({ item }) => <FavoriteCard favorite={item} />}
      contentContainerStyle={{
        ...AppStyles.section,
        backgroundColor: Colors[colorScheme].background,
      }}
      style={{ backgroundColor: Colors[colorScheme].background }}
      ListEmptyComponent={
        <EmptyList
          SVGElement={SVGImagination}
          primaryText="No favorites"
          secondaryText={
            "Press the ☆ icon on a course\ndetails page to favorite it!"
          }
        />
      }
    />
  );
}

const styles = StyleSheet.create({});
