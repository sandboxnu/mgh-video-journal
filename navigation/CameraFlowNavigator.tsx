import React, { ReactElement, useState } from "react";
import CameraRecording from "../screens/CameraRecording";
import LetsStartRecording from "../screens/LetsStartRecording";
import PrepareFace from "../screens/PrepareFace";
import { useMainNavigation } from "../hooks/useMainNavigation";
import { NavigationState } from "./MainNavigationContext";

interface CameraFlowNavigatorProps<T> {
  objects: T[];
  overlayCreator: (object: T, index: number) => ReactElement;
  nameCreator: (object: T, index: number) => string;
  nextState: NavigationState;
  recordingDay: number;
  overlayBackgroundColor: string;
}

enum CurrentScreen {
  prepareFace,
  letsStart,
  recording,
}

function CameraFlowNavigator<T>({
  objects,
  overlayCreator,
  nameCreator,
  nextState,
  recordingDay,
  overlayBackgroundColor,
}: CameraFlowNavigatorProps<T>): ReactElement {
  let objectValues = objects;
  let overlayCreatorFunc = overlayCreator;
  const [currentObjectIndex, setCurrentObjectIndex] = useState(0);
  const [currentState, setCurrentState] = useState(CurrentScreen.prepareFace);
  const navigation = useMainNavigation();

  if (currentObjectIndex + 1 >= objectValues.length) {
    navigation.navigate(nextState);
  }

  switch (currentState) {
    case CurrentScreen.prepareFace:
      return (
        <PrepareFace
          finished={() =>
            setCurrentState(
              currentObjectIndex === 0 && recordingDay === 1
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
          overlayBackgroundColor={overlayBackgroundColor}
          overlay={overlayCreatorFunc(
            objectValues[currentObjectIndex],
            currentObjectIndex
          )}
          finished={() => {
            if (currentObjectIndex + 1 >= objectValues.length) {
              navigation.navigate(nextState);
            } else {
              setCurrentObjectIndex(currentObjectIndex + 1);
              setCurrentState(CurrentScreen.prepareFace);
            }
          }}
          videoName={nameCreator(
            objectValues[currentObjectIndex],
            currentObjectIndex
          )}
        />
      );
  }
}

export default CameraFlowNavigator;
