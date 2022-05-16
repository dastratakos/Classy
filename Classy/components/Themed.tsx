/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */
import {
  ActivityIndicator as DefaultActivityIndicator,
  Text as DefaultText,
  View as DefaultView,
} from "react-native";

import Colors from "../constants/Colors";
import { FontAwesome, SimpleLineIcons } from "@expo/vector-icons";
import useColorScheme from "../hooks/useColorScheme";
import AppStyles from "../styles/AppStyles";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

type IconOtherProps = {
  name?: string;
  size?: number;
  style?: Object;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type IconProps = ThemeProps & IconOtherProps;
export type ActivityIndicatorProps = ThemeProps &
  DefaultActivityIndicator["props"];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function Icon(props: IconProps) {
  const { lightColor, darkColor, style, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return <FontAwesome style={[{ color }, style]} {...otherProps} />;
}

export function Icon2(props: IconProps) {
  const { lightColor, darkColor, style, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return <SimpleLineIcons style={[{ color }, style]} {...otherProps} />;
}

export function ActivityIndicator(props: ActivityIndicatorProps) {
  const { lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return (
    <View style={AppStyles.activityIndicatorContainer}>
      <DefaultActivityIndicator />
    </View>
  );
}
