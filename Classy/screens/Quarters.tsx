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
import { QuartersProps } from "../types";
import QuarterButton from "../components/Buttons/QuarterButton";

export default function Quarters({ route }: QuartersProps) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  const [editMode, setEditMode] = useState(false);

  if (!route.params.user.terms) return null;

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
                      /* Summer term with no units. */
                      if (parseInt(termId) % 10 === 8 && numUnits === 0)
                        return null;

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
      {route.params.user.id === context.user.id && (
        <View style={styles.ctaContainer}>
          {editMode ? (
            <>
              <View style={{ width: "48%", backgroundColor: "transparent" }}>
                <Button
                  text="Cancel"
                  onPress={() => {
                    setEditMode(false);
                  }}
                />
              </View>
              <View style={{ width: "48%", backgroundColor: "transparent" }}>
                <Button
                  text="Done"
                  onPress={() => {
                    // updateQuartersDBs();
                    setEditMode(false);
                  }}
                  emphasized
                />
              </View>
            </>
          ) : // <Button
          //   text="Edit Quarters"
          //   onPress={() => setEditMode(true)}
          //   wide
          // />
          null}
        </View>
      )}
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
    width: "30%",
    marginVertical: Layout.spacing.small,
    backgroundColor: "transparent",
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
    // backgroundColor: Colors.white,
    // borderRadius: Layout.icon.medium / 2,
    backgroundColor: "transparent",
  },
});
