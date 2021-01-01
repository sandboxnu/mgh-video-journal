import { useNavigation } from "@react-navigation/native";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { View } from "../components/Themed";
import CameraRecording from "../screens/CameraRecording";
import LetsStartRecording from "../screens/LetsStartRecording";
import PrepareFace from "../screens/PrepareFace";
import { Text } from "../components/Themed";

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
  // Right now we are using the default values, since we are not sure the best way to pass in the props
  // In a follow-up pr we will deal more with the navigation aspect
  let objectValues = objects || [1, 2, 3];
  let overlayCreatorFunc =
    overlayCreator || ((num: number) => <Text>{num}</Text>);
  const [currentObjectIndex, setCurrentObjectIndex] = useState(0);
  const [currentState, setCurrentState] = useState(CurrentScreen.prepareFace);
  const navigation = useNavigation();
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
              navigation.navigate("PredictEpisodes");
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
