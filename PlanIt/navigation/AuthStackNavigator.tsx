import * as React from "react";

import { AuthStackScreenProps } from "../types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import Register from "../screens/Register";
import ResetPassword from "../screens/ResetPassword";

const Stack = createNativeStackNavigator();

export default function AuthStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{ title: "Reset Password" }}
      />
    </Stack.Navigator>
  );
}
