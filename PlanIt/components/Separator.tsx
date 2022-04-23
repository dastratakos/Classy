import { View } from "./Themed";

import Colors from "../constants/Colors";
import AppStyles from "../styles/AppStyles";

export default function Separator() {
  return (
    <View
      style={AppStyles.separator}
      lightColor={Colors.light.imagePlaceholder}
      darkColor={Colors.dark.imagePlaceholder}
    />
  );
}
