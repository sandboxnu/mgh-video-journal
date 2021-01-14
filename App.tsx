import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import MainNavigator from "./navigation/MainNavigator";
import LinkingConfiguration from "./navigation/LinkingConfiguration";
import { NavigationScreens } from "./navigation/MainNavigationContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./utils/AsyncStorageUtils";
import { AppStateStorage } from "./types";
import {
  areDaysEqual,
  getCurrentDate,
  retrieveRecordingDay,
} from "./utils/TimeUtils";
import { AppState } from "react-native";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [startingState, setStartingState] = useState<AppStateStorage | null>(
    null
  );

  // When getting the state from async storage, the date property is still stored as a string. This fixes that
  const fixDates = (state: AppStateStorage): AppStateStorage => {
    return {
      ...state,
      date: new Date(state.date),
    };
  };

  const validateCurrentDayOrGoToNext = async (
    appStorage: AppStateStorage
  ): Promise<AppStateStorage> => {
    if (appStorage.state.type === NavigationScreens.onboarding) {
      return appStorage;
    }
    // If the days are equal from what is on disk, then do nothing. The interesting case is when the days change
    if (areDaysEqual(appStorage.date, getCurrentDate())) {
      return appStorage;
    } else {
      const recordingDay = await retrieveRecordingDay();
      if (recordingDay === 2 || recordingDay === 3) {
        return {
          state: { type: "onboarding2or3", recordingDay },
          date: getCurrentDate(),
        };
      } else {
        return {
          state: { type: NavigationScreens.episodeClearing },
          date: getCurrentDate(),
        };
      }
    }
  };

  const updateCurrentState = async () => {
    AsyncStorage.getItem(STORAGE_KEYS.currentState())
      .then((value) =>
        value != null
          ? JSON.parse(value)
          : {
              state: { type: NavigationScreens.onboarding },
              date: getCurrentDate(),
            }
      )
      .then(fixDates)
      .then(validateCurrentDayOrGoToNext)
      .then(setStartingState);
  };

  useEffect(() => {
    updateCurrentState();
    const listenerHandler = (_: any) => updateCurrentState();
    // Whenever the app changes state, we update our state
    AppState.addEventListener("change", listenerHandler);
    return () => AppState.removeEventListener("change", listenerHandler);
  }, []);

  if (!isLoadingComplete || startingState === null) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <NavigationContainer
          linking={LinkingConfiguration}
          theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <MainNavigator startingState={startingState.state} />
        </NavigationContainer>
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}
