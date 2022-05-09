import { ScrollView, StyleSheet } from "react-native";
import { Icon, Text, View } from "../components/Themed";

import Button from "../components/Buttons/Button";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";
import AppStyles from "../styles/AppStyles";
import { useContext, useState } from "react";
import AppContext from "../context/Context";
import { termIdToQuarterName } from "../utils";

export default function MyQuarters() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  const [editMode, setEditMode] = useState(false);

  return (
    <>
      <ScrollView
        style={{ backgroundColor: Colors[colorScheme].background }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <View style={AppStyles.section}>
          {Object.entries(context.user.terms)
            .sort()
            .reverse()
            .map(([year, terms]) => (
              <View style={styles.yearContainer} key={year}>
                <Text style={styles.year}>{year}</Text>
                <View style={styles.quartersContainer}>
                  {Object.entries(terms)
                    .sort()
                    .map(([termId, numUnits]) => {
                      /* Summer term with no units. */
                      if (parseInt(termId) % 10 === 8 && numUnits === 0)
                        return null;

                      return (
                        <View style={styles.termButton} key={termId}>
                          <Button
                            text={`${termIdToQuarterName(
                              termId
                            )} (${numUnits})`}
                            onPress={() =>
                              navigation.navigate("Courses", { termId })
                            }
                          />
                          {editMode && (
                            <View style={styles.minusButton}>
                              <Icon
                                name="minus-circle"
                                size={Layout.icon.medium}
                                lightColor={Colors.deepRed}
                                darkColor={Colors.deepRed}
                              />
                            </View>
                          )}
                        </View>
                      );
                    })}
                </View>
              </View>
            ))}
          {editMode && (
            <View style={AppStyles.row}>
              <Button
                text="2017-18"
                onPress={() => console.log("2017-18 pressed")}
              />
              <Button
                text="2022-23"
                onPress={() => console.log("2022-23 pressed")}
              />
            </View>
          )}
        </View>
      </ScrollView>
      {/* TODO: edit quarters */}
      {/* <View style={styles.ctaContainer}>
        {editMode ? (
          <>
            <Button
              text="Cancel"
              onPress={() => {
                setEditMode(false);
              }}
            />
            <Button
              text="Done"
              onPress={() => {
                // updateQuartersDBs();
                setEditMode(false);
              }}
              emphasized
            />
          </>
        ) : (
          <Button text="Edit Quarters" onPress={() => setEditMode(true)} wide />
        )}
      </View> */}
    </>
  );
}

const styles = StyleSheet.create({
  yearContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: Layout.spacing.small,
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
    flexWrap: "wrap",
  },
  termButton: {
    width: "30%",
    marginVertical: Layout.spacing.small,
  },
  ctaContainer: {
    ...AppStyles.row,
    position: "absolute",
    bottom: Layout.spacing.medium,
    left: Layout.spacing.medium,
    right: Layout.spacing.medium,
    backgroundColor: "transparent",
  },
  minusButton: {
    position: "absolute",
    right: -8,
    top: -8,
  },
});
