import React, { ReactElement, useState } from "react";
import CameraRecording from "../screens/CameraRecording";
import LetsStartRecording from "../screens/LetsStartRecording";
import PrepareFace from "../screens/PrepareFace";
import { Text } from "../components/Themed";
import { useMainNavigation } from "../hooks/useMainNavigation";
import { NavigationScreens } from "./MainNavigationContext";

interface CameraFlowNavigatorProps<T> {
  objects: T[];
  overlayCreator: (object: T) => ReactElement;
}

enum CurrentScreen {
  prepareFace,
  letsStart,
  recording,
}

function CameraFlowNavigator<T>({
  objects,
  overlayCreator,
}: CameraFlowNavigatorProps<T>): ReactElement {
  let objectValues = objects;
  let overlayCreatorFunc = overlayCreator;
  const [currentObjectIndex, setCurrentObjectIndex] = useState(0);
  const [currentState, setCurrentState] = useState(CurrentScreen.prepareFace);
  const navigation = useMainNavigation();
  switch (currentState) {
    case CurrentScreen.prepareFace:
      return (
        <PrepareFace
          finished={() =>
            setCurrentState(
              currentObjectIndex === 0
                ? CurrentScreen.letsStart
                : CurrentScreen.recording
            )
          }
        />
      );
    case CurrentScreen.letsStart:
      return (
        <LetsStartRecording
          finished={() => setCurrentState(CurrentScreen.recording)}
        />
      );
    case CurrentScreen.recording:
      return (
        <CameraRecording
          overlay={overlayCreatorFunc(objectValues[currentObjectIndex])}
          finished={() => {
            if (currentObjectIndex + 1 >= objectValues.length) {
              navigation.navigate({ type: NavigationScreens.predictions });
            } else {
              setCurrentObjectIndex(currentObjectIndex + 1);
              setCurrentState(CurrentScreen.prepareFace);
            }
          }}
        />
      );
  }
}

export default CameraFlowNavigator;
