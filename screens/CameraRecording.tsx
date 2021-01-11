import { Camera } from "expo-camera";
import React, {
  FunctionComponent,
  ReactElement,
  useEffect,
  useState,
} from "react";
import { StyleSheet, View, Image } from "react-native";
import { Button, Text } from "../components/Themed";
import { uploadFileToFirebase } from "../clients/firebaseInteractor";
import Colors from "../constants/Colors";
import { BlurView } from "expo-blur";

export interface SavedOverlayProps {
  finished: () => void;
}

const SavedOverlay: FunctionComponent<SavedOverlayProps> = ({ finished }) => {
  return (
    <View style={SavedOverlayViews.container}>
      <Text style={SavedOverlayViews.header}>
        Your video diary has been saved
      </Text>
      <Text style={SavedOverlayViews.subTitle}>
        Before you go on to your next recording, please check that your face is
        visible in the window below.
      </Text>
      <Button style={SavedOverlayViews.button} onPress={finished}>
        <Text style={SavedOverlayViews.buttonText}>Continue</Text>
      </Button>
    </View>
  );
};

const SavedOverlayViews = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
  },
  header: {
    color: "white",
    fontWeight: "500",
    fontSize: 30,
    margin: "5%",
  },
  subTitle: {
    color: "white",
    fontWeight: "400",
    fontSize: 18,
    marginHorizontal: "5%",
  },
  button: {
    position: "absolute",
    width: "90%",
    bottom: "10%",
    left: "5%",
    backgroundColor: Colors.allowedButtonColor,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    padding: 20,
  },
});

const COUNTDOWN_TIME = 10;
// ~150MB
const MAX_FILE_SIZE = 150000000;
const FourEightyP = "480P";

export interface CameraRecordingProps {
  overlay: ReactElement;
  finished: () => void;
  videoName: string;
  overlayBackgroundColor: string;
}

const CameraRecording: FunctionComponent<CameraRecordingProps> = ({
  overlay,
  finished,
  videoName,
  overlayBackgroundColor,
}) => {
  const [recording, setRecording] = useState(false);
  const [camera, setCamera] = useState<Camera | null>(null);
  const [time, setTime] = useState(0);
  const [countdownTime, setCountdownTime] = useState(COUNTDOWN_TIME);
  useEffect(() => {
    let unsubscribe: number | undefined = undefined;
    if (recording) {
      unsubscribe = window.setTimeout(() => setTime(time + 1000), 1000);
    }
    return () => window.clearTimeout(unsubscribe);
  }, [time, recording]);

  useEffect(() => {
    let unsubscribe: number | undefined = undefined;
    if (countdownTime > 0) {
      unsubscribe = window.setTimeout(
        () => setCountdownTime(countdownTime - 1),
        1000
      );
    }
    return () => window.clearTimeout(unsubscribe);
  }, [countdownTime]);

  if (countdownTime == 0 && !recording && camera) {
    setRecording(true);
    setCountdownTime(-1);
    camera
      .recordAsync({
        maxFileSize: MAX_FILE_SIZE,
        quality: Camera.Constants.VideoQuality[FourEightyP],
      })
      .then((vid) => {
        uploadFileToFirebase(`${videoName}.mov`, vid.uri);
        setRecording(false);
      });
  }

  let dateTime = new Date(60 * 5 * 1000 - time);
  const toTens = (num: number) => (num >= 10 ? "" + num : "0" + num);
  if (dateTime.getTime() <= 0 && recording) {
    setRecording(false);
    camera?.stopRecording();
  }
  const shouldShowCamera = countdownTime >= 0 || recording;
  return (
    <View style={Styles.container}>
      {shouldShowCamera && (
        <Camera
          style={Styles.camera}
          type={Camera.Constants.Type.front}
          ref={(camera) => setCamera(camera)}
          flashMode={Camera.Constants.FlashMode.auto}
        />
      )}
      {countdownTime >= 0 && !recording && (
        <View
          style={{
            ...Styles.overlayView,
            backgroundColor: overlayBackgroundColor,
          }}
        >
          {overlay}
          <Text
            style={{
              ...Styles.beginText,
              color:
                overlayBackgroundColor === Colors.darkOverlay
                  ? "white"
                  : Colors.avocadoGreen,
            }}
          >{`Your recording will begin in ${countdownTime} seconds.`}</Text>
        </View>
      )}
      {recording && (
        <>
          <BlurView style={Styles.camera} intensity={100} />
          <View style={Styles.bottomRow}>
            <Button
              style={Styles.icon}
              onPress={() => {
                if (camera) {
                  camera.stopRecording();
                  setRecording(false);
                }
              }}
            >
              <Image
                style={Styles.image}
                source={require("../assets/images/RecordingButton.png")}
              />
            </Button>
          </View>
          <View style={Styles.totalTime}>
            <Image
              style={Styles.recordingImage}
              source={require("../assets/images/RecordingIndicator.png")}
            />
            <Text style={Styles.text}>
              {toTens(dateTime.getMinutes()) +
                ":" +
                toTens(dateTime.getSeconds())}
            </Text>
          </View>
        </>
      )}
      {!shouldShowCamera && <SavedOverlay finished={finished} />}
    </View>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    alignItems: "baseline",
  },
  camera: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
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
    justifyContent: "center",
  },
  text: {
    color: "white",
    textAlign: "center",
  },
  totalTime: {
    backgroundColor: "rgba(0, 0, 0, 0.33)",
    padding: 10,
    position: "absolute",
    top: 40,
    right: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icon: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0)",
    justifyContent: "center",
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: "center",
  },
  overlayView: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 70, 67, .93)",
    top: 0,
    left: 0,
    justifyContent: "space-around",
    alignItems: "center",
  },
  beginText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "400",
  },
  recordingImage: {
    height: 16,
    width: 16,
    marginRight: 5,
  },
});

export default CameraRecording;
