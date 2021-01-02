import React, {
  FunctionComponent,
  ReactElement,
  useCallback,
  useState,
} from "react";
import { LayoutAnimation, Platform, StyleSheet, UIManager } from "react-native";
import { View, Text } from "../components/Themed";
import EpisodePredictionWrapper from "../screens/EpisodePrediction";
import MainScreen from "../screens/MainScreen";
import CameraFlowNavigator from "./CameraFlowNavigator";
import {
  MainNavigationContext,
  NavigationScreens,
  NavigationState,
} from "./MainNavigationContext";
import EpisodeNavigator from "./MainStack";

const MainNavigator: FunctionComponent = () => {
  const [navigationState, setNavigationState] = useState<NavigationState>({
    type: NavigationScreens.intro,
  });

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
      // Putting a default value into the overlay creator until we have the actual value
      return (
        <CameraFlowNavigator
          objects={navigationState.episodes}
          overlayCreator={(episode) => (
            <Text style={{ color: "white" }}>{episode.name}</Text>
          )}
        />
      );
    } else if (navigationState.type == NavigationScreens.createEpisode) {
      return <EpisodeNavigator />;
    } else if (navigationState.type == NavigationScreens.predictions) {
      return <EpisodePredictionWrapper />;
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
