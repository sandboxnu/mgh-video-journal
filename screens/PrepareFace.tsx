// imported to try and get face detection to work
import * as _FaceDetector from "expo-face-detector";
import { Camera } from "expo-camera";
import React, {
  FunctionComponent,
  ReactElement,
  useEffect,
  useState,
} from "react";
import {
  StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewStyle,
  Dimensions,
} from "react-native";
import { Button, Text } from "../components/Themed";
import Colors from "../constants/Colors";
import { continueButtonStyle } from "../utils/StylingUtils";
import * as Permissions from "expo-permissions";

const SpacingDiv = () => {
  return <View style={{ flex: 1 }} />;
};

interface BottomInfoPromptProps {
  inScreen: boolean;
}

const BottomInfoPrompt: FunctionComponent<
  BottomInfoPromptProps & PrepareFaceProps
> = ({ inScreen, finished }): ReactElement => {
  return (
    <View style={BottomInfoPromptStyles.container}>
      {!inScreen && (
        <View style={BottomInfoPromptStyles.adjustCameraView}>
          <Text style={BottomInfoPromptStyles.adjustCameraText}>
            please adjust your camera
          </Text>
        </View>
      )}
      <View style={BottomInfoPromptStyles.bottomInfoContainer}>
        <SpacingDiv />
        <Text style={BottomInfoPromptStyles.text}>
          Please check that your face is visible in the window below. When your
          face is centered, please press the button.
        </Text>
        <SpacingDiv />
        <Button
          style={{
            ...continueButtonStyle(inScreen).style,
            ...BottomInfoPromptStyles.button,
          }}
          disabled={!inScreen}
          onPress={finished}
        >
          <Text style={BottomInfoPromptStyles.buttonText}>
            My face is in the window
          </Text>
        </Button>
        <SpacingDiv />
      </View>
    </View>
  );
};

const BottomInfoPromptStyles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    minHeight: "25%",
  },
  bottomInfoContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.67)",
    justifyContent: "space-around",
    paddingHorizontal: "5%",
    paddingBottom: 20,
  },
  text: {
    flex: 3,
    fontWeight: "400",
    fontSize: 18,
    color: "white",
    padding: 10,
    textAlign: "center",
  },
  button: {
    flex: 3,
    padding: 10,
    justifyContent: undefined,
    alignItems: undefined,
    maxHeight: undefined,
  },
  buttonText: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "400",
    color: "white",
  },
  adjustCameraView: {
    borderRadius: 24,
    backgroundColor: "black",
    width: "75%",
    marginHorizontal: "12.5%",
    marginBottom: 5,
  },
  adjustCameraText: {
    textAlign: "center",
    padding: 5,
    color: "white",
    flex: 1,
  },
});

interface Face {
  bounds: {
    origin: { x: number; y: number };
    size: { width: number; height: number };
  };
}

interface PrepareFaceProps {
  finished: () => void;
}

const PrepareFace: FunctionComponent<PrepareFaceProps> = ({ finished }) => {
  const [seeingFace, setSeeingFace] = useState(true);
  const [permissions, setHasPermission] = useState(false);
  // Using the hook so that if the orientation changes, it will update
  let dimensions = useWindowDimensions();
  dimensions = Dimensions.get("screen");
  let boundingBox = {
    left: dimensions.width / 20,
    width: (dimensions.width * 9) / 10,
    top: dimensions.height / 10,
    height: (dimensions.height * 2) / 3,
  };
  useEffect(() => {
    Camera.requestPermissionsAsync()
      .then(() => Permissions.askAsync(Permissions.AUDIO_RECORDING))
      .then((response) => {
        setHasPermission(response.status === "granted");
      });
  }, []);
  if (!permissions) {
    return <Text>Please give permissions</Text>;
  }
  const inBoundingBox = ({ bounds: { size, origin } }: Face): boolean => {
    return (
      origin.x + size.width / 4 >= boundingBox.left &&
      origin.x + (size.width * 3) / 4 <= boundingBox.left + boundingBox.width &&
      origin.y + size.height / 4 >= boundingBox.top &&
      origin.y + (size.height * 3) / 4 <= boundingBox.top + boundingBox.height
    );
  };
  return (
    <View style={Styles.container}>
      <Camera
        style={Styles.camera}
        type={Camera.Constants.Type.front}
        onFacesDetected={(face) =>
          setSeeingFace(face.faces.some(inBoundingBox))
        }
        flashMode={Camera.Constants.FlashMode.auto}
      />
      <View
        style={InViewRectStyle(
          boundingBox.left,
          boundingBox.top,
          boundingBox.width,
          boundingBox.height,
          seeingFace
        )}
      />
      <BottomInfoPrompt inScreen={seeingFace} finished={finished} />
    </View>
  );
};

const InViewRectStyle = (
  left: number,
  top: number,
  width: number,
  height: number,
  seen: boolean
): StyleProp<ViewStyle> => ({
  position: "absolute",
  left: left,
  top: top,
  width: width,
  height: height,
  borderWidth: 3,
  borderStyle: "dashed",
  borderColor: seen
    ? Colors.seeingFaceRectBorderColor
    : Colors.notSeeingFaceRectBorderColor,
  backgroundColor: "rgba(0, 0, 0, 0)",
});

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    alignItems: "baseline",
  },
  camera: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  flip: {
    flex: 1,
    backgroundColor: "#0000",
  },
  bottomRow: {
    bottom: 0,
    width: "100%",
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "center",
    padding: 10,
  },
  takePicture: {
    flex: 1,
    backgroundColor: "#0000",
  },
  text: {
    color: "black",
    textAlign: "center",
  },
  faceShow: {
    color: "black",
    textAlign: "center",
    flex: 1,
    backgroundColor: "green",
  },
  button: {
    backgroundColor: "#fff",
  },
});

export default PrepareFace;
