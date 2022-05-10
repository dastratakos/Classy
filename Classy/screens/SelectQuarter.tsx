import * as Haptics from "expo-haptics";

import { ScrollView, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import { termIdToQuarterName, termIdToYear } from "../utils";
import { useContext, useEffect, useState } from "react";

import AppContext from "../context/Context";
import AppStyles from "../styles/AppStyles";
import Button from "../components/Buttons/Button";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";
import { SelectQuarterProps } from "../types";
import useColorScheme from "../hooks/useColorScheme";
import { useNavigation } from "@react-navigation/core";

export default function SelectQuarter({ route }: SelectQuarterProps) {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const context = useContext(AppContext);

  const [quarters, setQuarters] = useState({});

  useEffect(() => {
    const buildQuarters = () => {
      const terms = route.params.terms;

      const quartersObj = {};
      for (let termId of terms) {
        const year = termIdToYear(termId);
        if (!(year in quartersObj)) {
          quartersObj[`${year}`] = {};
          quartersObj[`${year}`][`${termId.slice(0, -1)}2`] = false;
          quartersObj[`${year}`][`${termId.slice(0, -1)}4`] = false;
          quartersObj[`${year}`][`${termId.slice(0, -1)}6`] = false;
          quartersObj[`${year}`][`${termId.slice(0, -1)}8`] = false;
        }
        quartersObj[`${year}`][`${termId}`] = true;
      }
      setQuarters({ ...quartersObj });
    };
    buildQuarters();
  }, []);

  return (
    <ScrollView
      style={{ backgroundColor: Colors[colorScheme].background }}
      contentContainerStyle={{
        marginBottom: Layout.spacing.xlarge,
        alignItems: "center",
      }}
    >
      <View style={AppStyles.section}>
        {Object.entries(quarters)
          .sort()
          .reverse()
          .map(([year, terms]) => (
            <View style={[styles.yearContainer, {backgroundColor: Colors[colorScheme].secondaryBackground}]} key={year}>
              <Text style={styles.year}>{year}</Text>
              <View style={[styles.quartersContainer]}>
                {Object.entries(terms)
                  .sort()
                  .map(([termId, available]) => {
                    return (
                      <View style={[styles.termButton]} key={termId}>
                        <Button
                          text={`${termIdToQuarterName(termId)}`}
                          onPress={() => {
                            Haptics.impactAsync(
                              Haptics.ImpactFeedbackStyle.Medium
                            );
                            context.setSelectedTerm(termId);
                            navigation.goBack();
                          }}
                          disabled={!available}
                          emphasized={termId === context.selectedTerm}
                        />
                      </View>
                    );
                  })}
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
    marginTop: Layout.spacing.small,
    paddingTop: Layout.spacing.small,
    marginBottom: Layout.spacing.large,
    paddingBottom: Layout.spacing.small,
    borderRadius: Layout.radius.large,
  },
  year: {
    fontSize: Layout.text.large,
    fontWeight: "500",
    marginBottom: Layout.spacing.xxsmall,
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
  },
});
