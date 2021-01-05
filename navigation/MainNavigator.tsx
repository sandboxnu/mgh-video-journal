import React, {
  FunctionComponent,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from "react";
import { LayoutAnimation, Platform, StyleSheet, UIManager } from "react-native";
import { signIn } from "../clients/firebaseInteractor";
import { View, Text } from "../components/Themed";
import { EpisodeListingOverview } from "../components/EpisodeListingOverview";
import EpisodePredictionWrapper from "../screens/EpisodePrediction";
import { EpisodeRecallOverview } from "../screens/EpisodeRecallOverview";
import MainScreen from "../screens/MainScreen";
import { Episode } from "../types";
import { retrieveRecordingDay } from "../utils/TimeUtils";
import CameraFlowNavigator from "./CameraFlowNavigator";
import {
  MainNavigationContext,
  NavigationScreens,
  NavigationState,
} from "./MainNavigationContext";
import EpisodeNavigator from "./MainStack";
import { EpisodeOverlay } from "../components/EpisodeOverlay";

const MainNavigator: FunctionComponent = () => {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    type: NavigationScreens.intro,
  });
  const [recordingDay, setRecordingDay] = useState(1);
  const participantId = 1;

  retrieveRecordingDay().then(setRecordingDay);

  useEffect(() => {
    // The email gets ignored rn, but will be used when we get to the email auth
    signIn("email");
  }, []);

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
          overlayCreator={(episode: Episode, index: number) => (
            <EpisodeOverlay episode={episode} index={index} />
          )}
          nameCreator={(episode: Episode, index: number) =>
            `${participantId}/${participantId}_${recordingDay}_${index}`
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
      navigationState.type == NavigationScreens.episodeRecallOverivew
    ) {
      return <EpisodeRecallOverview />;
    } else if (navigationState.type == "episodeRecall") {
      return (
        <CameraFlowNavigator
          objects={navigationState.episodes}
          overlayCreator={(episode: Episode, index: number) => (
            <EpisodeOverlay episode={episode} index={index} />
          )}
          nameCreator={(episode: Episode, index: number) =>
            `${participantId}/${participantId}_${recordingDay}_${index}_recall`
          }
          nextState={{ type: NavigationScreens.createEpisode }}
          recordingDay={recordingDay}
        />
      );
    } else if (
      navigationState.type == NavigationScreens.episodeListingOverview
    ) {
      return (
        <CameraFlowNavigator
          objects={[true]}
          overlayCreator={(_) => <EpisodeListingOverview />}
          nameCreator={() =>
            `${participantId}/${participantId}_${recordingDay}_episodeListing`
          }
          nextState={{ type: NavigationScreens.episodeRecallOverivew }}
          recordingDay={recordingDay}
        />
      );
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