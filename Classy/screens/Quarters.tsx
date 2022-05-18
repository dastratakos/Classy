import { ScrollView, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";

import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import AppStyles from "../styles/AppStyles";
import { termIdToQuarterName } from "../utils";
import { QuartersProps } from "../types";
import QuarterButton from "../components/Buttons/QuarterButton";

export default function Quarters({ route }: QuartersProps) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  if (!route.params.user.terms) return null;

  const quarterColors = new Map([
    ["Aut", { backgroundColor: Colors.quarters.autumn }],
    ["Win", { backgroundColor: Colors.quarters.winter }],
    ["Spr", { backgroundColor: Colors.quarters.spring }],
    ["Sum", { backgroundColor: Colors.quarters.summer }],
  ]);

  return (
    <>
      <ScrollView
        style={{ backgroundColor: Colors[colorScheme].background }}
        contentContainerStyle={{
          alignItems: "center",
          paddingBottom: Layout.buttonHeight.medium + Layout.spacing.medium,
        }}
      >
        <View style={AppStyles.section}>
          {Object.entries(route.params.user.terms)
            .sort()
            .reverse()
            .map(([year, terms]) => (
              <View
                style={[
                  styles.yearContainer,
                  { backgroundColor: Colors[colorScheme].secondaryBackground },
                ]}
                key={year}
              >
                <Text style={styles.year}>{year}</Text>
                <View style={styles.quartersContainer}>
                  {Object.entries(terms)
                    .sort()
                    .map(([termId, numUnits]) => {
                      const color =
                        numUnits > 0
                          ? quarterColors.get(termIdToQuarterName(termId))
                          : {};
                      return (
                        <View style={styles.termButton} key={termId}>
                          <QuarterButton
                            text={termIdToQuarterName(termId)}
                            num={`${numUnits}`}
                            onPress={() =>
                              navigation.navigate("Enrollments", {
                                userId: route.params.user.id,
                                termId,
                              })
                            }
                            color={color}
                          />
                        </View>
                      );
                    })}
                </View>
              </View>
            ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  yearContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: Layout.spacing.small,
    paddingTop: Layout.spacing.small,
    marginBottom: Layout.spacing.large,
    paddingBottom: Layout.spacing.small,
    borderRadius: Layout.radius.large,
  },
  year: {
    fontSize: Layout.text.large,
    fontWeight: "500",
    marginBottom: Layout.spacing.medium,
  },
  quartersContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    backgroundColor: "transparent",
  },
  termButton: {
    width: "22%",
    marginBottom: Layout.spacing.small,
    backgroundColor: "transparent",
  },
});
