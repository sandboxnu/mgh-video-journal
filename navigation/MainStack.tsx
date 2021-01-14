import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { EpisodeInputStackParamList } from "../types";
import EpisodeInputScreen from "../screens/EpisodeInputFlow/EpisodeInputScreen";
import EpisodeDisplayScreen from "../screens/EpisodeInputFlow/EpisodeDisplayScreen";
import EpisodeConfirmationScreen from "../screens/EpisodeInputFlow/EpisodeConfirmationScreen";
import EpisodeEditScreen from "../screens/EpisodeInputFlow/EpisodeEditScreen";

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const EpisodeInputStack = createStackNavigator<EpisodeInputStackParamList>();

interface EpisodeInputNavigatorProps {
  recordingDay: number;
}

export default function EpisodeInputNavigator({
  recordingDay,
}: EpisodeInputNavigatorProps) {
  const EpisodeInput = () => <EpisodeInputScreen recordingDay={recordingDay} />;
  return (
    <EpisodeInputStack.Navigator>
      <EpisodeInputStack.Screen
        name="EpisodeInput"
        component={EpisodeInput}
        options={{ headerShown: false }}
      />
      <EpisodeInputStack.Screen
        name="EpisodeDisplay"
        component={EpisodeDisplayScreen}
        options={{ headerShown: false }}
      />
      <EpisodeInputStack.Screen
        name="EpisodeConfirmation"
        component={EpisodeConfirmationScreen}
        options={{ headerShown: false }}
      />
      <EpisodeInputStack.Screen
        name="EpisodeEdit"
        component={EpisodeEditScreen}
        options={{ headerShown: false }}
      />
    </EpisodeInputStack.Navigator>
  );
}
