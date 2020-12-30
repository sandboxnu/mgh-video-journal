import { useNavigation } from "@react-navigation/native";
import { Camera } from "expo-camera";
import React, { FunctionComponent, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "../components/Themed";
import { Ionicons } from "@expo/vector-icons";
const PrepareFace: FunctionComponent = () => {
  const navigation = useNavigation();
  const [seeingFace, setSeeingFace] = useState(true);
  const [permissions, setHasPermission] = useState(false);
  useEffect(() => {
    Camera.requestPermissionsAsync().then((response) => {
      setHasPermission(response.status === "granted");
    });
  }, []);
  if (!permissions) {
    return <Text>Please give permissions</Text>;
  }
  return (
    <View style={Styles.container}>
      <Camera
        style={Styles.camera}
        type={Camera.Constants.Type.front}
        onFacesDetected={(face) => setSeeingFace(face.faces.length > 0)}
        flashMode={Camera.Constants.FlashMode.auto}
      />
      <View style={Styles.bottomRow}>
        <Ionicons.Button
          style={Styles.button}
          name={seeingFace ? "arrow-forward-circle" : "hand-left"}
          color={!seeingFace ? "red" : "black"}
          onPress={() => {
            //@ts-ignore
            navigation.replace("Camera");
          }}
          disabled={!seeingFace}
        >
          {seeingFace
            ? "Begin Recording"
            : "Please Show Your Face to Begin Recording"}
        </Ionicons.Button>
      </View>
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
