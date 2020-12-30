import { Camera } from "expo-camera";
import React, { FunctionComponent, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "../components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { uploadFileToFirebase } from "../clients/firebaseInteractor";

const CameraRecording: FunctionComponent = () => {
  const [recording, setRecording] = useState(false);
  const [permissions, setHasPermission] = useState(false);
  const [camera, setCamera] = useState<Camera | null>(null);
  const [time, setTime] = useState(0);
  useEffect(() => {
    Camera.requestPermissionsAsync().then((response) => {
      setHasPermission(response.status === "granted");
    });
  }, []);
  useEffect(() => {
    if (recording) {
      window.setTimeout(() => setTime(time + 1000), 1000);
    }
  }, [time, recording]);
  if (!permissions) {
    return <Text>Please give permissions</Text>;
  }
  let dateTime = new Date(60 * 5 * 1000 - time);
  const toTens = (num: number) => (num >= 10 ? "" + num : "0" + num);
  if (dateTime.getTime() <= 0 && recording) {
    setRecording(false);
    camera?.stopRecording();
  }
  return (
    <View style={Styles.container}>
      <Camera
        style={Styles.camera}
        type={Camera.Constants.Type.front}
        ref={(camera) => setCamera(camera)}
        flashMode={Camera.Constants.FlashMode.auto}
      />
      <View style={Styles.bottomRow}>
        <Ionicons.Button
          style={Styles.icon}
          color="black"
          name={recording ? "stop-circle" : "camera"}
          onPress={() => {
            if (camera && !recording) {
              setRecording(true);
              camera
                .recordAsync({
                  maxFileSize: 150000000,
                  quality: Camera.Constants.VideoQuality["480p"],
                })
                .then(async (vid) => {
                  await uploadFileToFirebase("avocado.mov", vid.uri);
                });
            } else if (camera && recording) {
              camera.stopRecording();
              setRecording(false);
            }
          }}
        >
          {recording ? "Stop Recording" : "Start Recording"}
        </Ionicons.Button>
      </View>
      {recording && (
        <View style={Styles.totalTime}>
          <Text style={Styles.text}>
            Time Left:{" "}
            {toTens(dateTime.getMinutes()) +
              ":" +
              toTens(dateTime.getSeconds())}
          </Text>
        </View>
      )}
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
    color: "black",
    textAlign: "center",
  },
  totalTime: {
    backgroundColor: "#fff",
    padding: 10,
    position: "absolute",
    top: 20,
    right: 5,
  },
  icon: {
    flex: 1,
    backgroundColor: "white",
  },
});

export default CameraRecording;
