import { View } from "./Themed";

import Colors from "../constants/Colors";
import AppStyles from "../styles/AppStyles";

export default function Separator({
  overrideStyles,
}: {
  overrideStyles?: Object
}) {
  return (
    <View
      style={[AppStyles.separator, overrideStyles]}
      lightColor={Colors.light.photoBackground}
      darkColor={Colors.dark.photoBackground}
    />
  );
}
