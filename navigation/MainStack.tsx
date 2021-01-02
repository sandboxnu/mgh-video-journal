import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import CameraRecording from "../screens/CameraRecording";
import PrepareFace from "../screens/PrepareFace";
import MainScreen from "../screens/MainScreen";
import { EpisodeInputStackParamList } from "../types";
import EpisodePrediction from "../screens/EpisodePrediction";
import EpisodeInputScreen from "../screens/EpisodeInputScreen";
import EpisodeDisplayScreen from "../screens/EpisodeDisplayScreen";
import CameraFlowNavigator from "./CameraFlowNavigator";
import { Text } from "../components/Themed";

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const EpisodeInputStack = createStackNavigator<EpisodeInputStackParamList>();

export default function EpisodeInputNavigator() {
  return (
    <EpisodeInputStack.Navigator>
      <EpisodeInputStack.Screen
        name="EpisodeInput"
        component={EpisodeInputScreen}
        options={{ headerShown: false }}
      />
      <EpisodeInputStack.Screen
        name="EpisodeDisplay"
        component={EpisodeDisplayScreen}
        options={{ headerShown: false }}
      />
    </EpisodeInputStack.Navigator>
  );
}
