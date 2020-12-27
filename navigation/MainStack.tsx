import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import CameraRecording from "../screens/CameraRecording";
import PrepareFace from "../screens/PrepareFace";
import MainScreen from "../screens/MainScreen";
import { MainStackParamList } from "../types";

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const MainStack = createStackNavigator<MainStackParamList>();

export default function MainNavigator() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="MainTab"
        component={MainScreen}
        options={{ headerTitle: "Tab One Title" }}
      />
      <MainStack.Screen
        name="PrepareFace"
        component={PrepareFace}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="Camera"
        component={CameraRecording}
        options={{ headerShown: false }}
      />
    </MainStack.Navigator>
  );
}
