import React, { FunctionComponent } from "react";
import { StyleSheet } from "react-native";
import { View, Text, Button } from "../components/Themed";

interface LetsStartRecordingProps {
  finished: () => void;
}
const LetsStartRecording: FunctionComponent<LetsStartRecordingProps> = ({
  finished,
}) => {
  return (
    <View style={Styles.container}>
      <Text style={Styles.title}>Great!</Text>
      <Text style={Styles.startRecordingText}>Let’s start recording</Text>
      <Text style={Styles.subText}>
        Please{" "}
        <Text style={Styles.innerSubtext}>describe your episode in detail</Text>
        . Describe where you were, what you thinking, feeling, doing and with
        whom. You can take as much time as you would like.{" "}
      </Text>
      <Button style={Styles.button} onPress={finished}>
        <Text style={Styles.buttonText}>Get Started!</Text>
      </Button>
    </View>
  );
};
const Styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingHorizontal: "5%",
    justifyContent: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "700",
  },
  startRecordingText: {
    fontSize: 30,
    fontWeight: "500",
    marginVertical: 10,
  },
  subText: {
    fontSize: 18,
    fontWeight: "400",
  },
  innerSubtext: {
    fontSize: 18,
    fontWeight: "700",
  },
  button: {
    width: "100%",
    backgroundColor: "#0038FF",
    position: "absolute",
    bottom: "10%",
    left: "5%",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "400",
    textAlign: "center",
    margin: 20,
  },
});

export default LetsStartRecording;
