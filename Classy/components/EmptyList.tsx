import { View, Text } from "../components/Themed";
import Layout from "../constants/Layout";
import { StyleSheet } from "react-native";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";
import { FunctionComponent, SVGProps } from "react";

export default function EmptyList({
  SVGElement,
  primaryText = "",
  secondaryText = "",
}: {
  SVGElement?: FunctionComponent<SVGProps>;
  primaryText?: string;
  secondaryText?: string;
}) {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      {SVGElement ? (
        <SVGElement style={styles.svg} width={250} height={200} />
      ) : null}
      {primaryText !== "" || secondaryText !== "" ? (
        <>
          <Text style={styles.primary}>{primaryText}</Text>
          <Text
            style={[
              styles.secondary,
              { color: Colors[colorScheme].secondaryText },
            ]}
          >
            {secondaryText}
          </Text>
        </>
      ) : (
        <Text style={styles.primary}>Nothing to see here</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  svg: {
    marginVertical: Layout.spacing.medium,
  },
  primary: {
    fontSize: Layout.text.large,
    textAlign: "center",
  },
  secondary: {
    fontSize: Layout.text.medium,
    padding: Layout.spacing.xsmall,
    textAlign: "center",
  },
});
