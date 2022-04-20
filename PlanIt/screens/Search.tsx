import { Text, View } from "../components/Themed";

import EditScreenInfo from "../components/EditScreenInfo";
import { StyleSheet } from "react-native";
import Colors from "../constants/Colors";

export default function Search() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search</Text>
      <View
        style={styles.separator}
        lightColor={Colors.light.imagePlaceholder}
        darkColor={Colors.dark.imagePlaceholder}
      />
      <EditScreenInfo path="/screens/Search.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
