import React, {
  FunctionComponent,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import { LayoutAnimation, Platform, StyleSheet, UIManager } from "react-native";
import { signIn } from "../clients/firebaseInteractor";
import { View } from "../components/Themed";
import { EpisodeListingOverview } from "../components/EpisodeListingOverview";
import EpisodePredictionWrapper from "../screens/EpisodePrediction";
import { EpisodeRecallOverview } from "../screens/EpisodeRecallOverview";
import MainScreen from "../screens/MainScreen";
import { Episode } from "../types";
import { getCurrentDate, retrieveRecordingDay } from "../utils/TimeUtils";
import CameraFlowNavigator from "./CameraFlowNavigator";
import {
  MainNavigationContext,
  NavigationScreens,
  NavigationState,
} from "./MainNavigationContext";
import EpisodeNavigator from "./MainStack";
import { EpisodeOverlay } from "../components/EpisodeOverlay";
import Colors from "../constants/Colors";
import { EpisodeRecallOverlay } from "../components/EpisodeRecallOverlay";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../utils/AsyncStorageUtils";
import OnboardingScreen from "../screens/OnboardingScreen";
import { EpisodeRecallFinished } from "../screens/EpisodeRecallFinished";

interface MainNavigatorProps {
  startingState: NavigationState;
}
const MainNavigator: FunctionComponent<MainNavigatorProps> = ({
  startingState,
}) => {
  // If you want to test a specific flow, update this startingState to be wherever you want to go to
  const [navigationState, setNavigationState] = useState<NavigationState>(
    startingState
  );
  const [recordingDay, setRecordingDay] = useState(1);
  const participantId = 1;

  retrieveRecordingDay().then(setRecordingDay);

  useEffect(() => {
    // The email gets ignored rn, but will be used when we get to the email auth
    signIn("email");
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE_KEYS.currentState(),
      JSON.stringify({
        state: navigationState,
        date: getCurrentDate(),
      })
    );
  }, [navigationState]);

  if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  // Get the correct screen from the given state
  const getScreen = (
    navigationState: NavigationState
  ): ReactElement | undefined => {
    if (navigationState.type == NavigationScreens.intro) {
      return <MainScreen />;
    } else if (navigationState.type === "recordEpisodes") {
      return (
        <CameraFlowNavigator
          objects={navigationState.episodes}
          overlayBackgroundColor={Colors.darkOverlay}
          overlayCreator={(episode: Episode, index: number) => (
            <EpisodeOverlay episode={episode} index={index} />
          )}
          nameCreator={(episode: Episode, index: number) =>
            `${participantId}/${participantId}_Day${recordingDay}_Episode${index}`
          }
          nextState={{ type: NavigationScreens.predictions }}
          recordingDay={recordingDay}
        />
      );
    } else if (navigationState.type == NavigationScreens.createEpisode) {
      return <EpisodeNavigator />;
    } else if (navigationState.type == NavigationScreens.predictions) {
      return <EpisodePredictionWrapper />;
    } else if (
      navigationState.type == NavigationScreens.episodeRecallOverview
    ) {
      return <EpisodeRecallOverview />;
    } else if (navigationState.type == "episodeRecall") {
      return (
        <CameraFlowNavigator
          objects={navigationState.episodes}
          overlayBackgroundColor={Colors.lightOverlay}
          overlayCreator={(episode: Episode) => (
            <EpisodeRecallOverlay episode={episode} />
          )}
          nameCreator={(_, index: number) =>
            `${participantId}/${participantId}_Day${recordingDay}_Episode${index}_recall`
          }
          nextState={{ type: NavigationScreens.episodeRecallFinished }}
          recordingDay={recordingDay}
        />
      );
    } else if (
      navigationState.type == NavigationScreens.episodeRecallFinished
    ) {
      return <EpisodeRecallFinished />;
    } else if (
      navigationState.type == NavigationScreens.episodeListingOverview
    ) {
      return (
        <CameraFlowNavigator
          objects={[true]}
          overlayBackgroundColor={Colors.darkOverlay}
          overlayCreator={(_) => <EpisodeListingOverview />}
          nameCreator={() =>
            `${participantId}/${participantId}_Day${recordingDay}_episodeListing`
          }
          nextState={{ type: NavigationScreens.episodeRecallOverview }}
          recordingDay={recordingDay}
        />
      );
    } else if (navigationState.type === NavigationScreens.onboarding) {
      return <OnboardingScreen />;
    } else {
      return undefined;
    }
  };

  let actualScreen = getScreen(navigationState);

  // Wrapper so that there is an animation.
  let navigationStateCallback = useCallback((navigation: NavigationState) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setNavigationState(navigation);
  }, []);

  return (
    <MainNavigationContext.Provider value={navigationStateCallback}>
      <View style={styles.container}>{actualScreen}</View>
    </MainNavigationContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    position: "absolute",
    top: 0,
    left: 0,
  },
});

export default MainNavigator;
