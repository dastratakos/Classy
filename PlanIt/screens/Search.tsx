import { Text, View } from "../components/Themed";

import EditScreenInfo from "../components/EditScreenInfo";
import { StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import Separator from "../components/Separator";

export default function Search() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search</Text>
      <Separator />
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
});
