import { ScrollView, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";

import Button from "../components/Buttons/Button";
import Colors from "../constants/Colors";
import CourseCard from "../components/CourseCard";
import Layout from "../constants/Layout";
import WideButton from "../components/Buttons/WideButton";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import AppStyles from "../styles/AppStyles";

const years = ["2018-19", "2019-20", "2020-21", "2021-22"];
const quarters = [
  { name: "Aut", numUnits: ["0", "15", "5", "13"] },
  { name: "Win", numUnits: ["0", "15", "19", "12"] },
  { name: "Spr", numUnits: ["0", "20", "19", "13"] },
];

export default function Quarters() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  return (
    <ScrollView
      style={{ backgroundColor: Colors[colorScheme].background }}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <View style={AppStyles.section}>
        {years.map((year, i) => (
          <View style={styles.yearContainer} key={i}>
            <Text style={styles.year}>{year}</Text>
            <View style={styles.quartersContainer}>
              {quarters.map((quarter, idx) => (
                <View style={{ width: "30%" }} key={idx}>
                  <Button
                    text={`${quarter.name} (${quarter.numUnits[i]})`}
                    onPress={() => navigation.navigate("Courses")}
                  />
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  yearContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: Layout.spacing.large,
    marginBottom: Layout.spacing.large,
  },
  year: {
    fontSize: Layout.text.large,
    fontWeight: "500",
    marginBottom: Layout.spacing.medium,
  },
  quartersContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
