import React, { useState, FunctionComponent } from "react";
import { Keyboard, View, TouchableWithoutFeedback, Text } from "react-native";
import { Episode } from "../types";
import {
  containerStyles,
  styles,
} from "../screens/EpisodeInputFlow/EpisodeInputCommonStyles";
import { EpisodeInputFields } from "./EpisodeInputFields";
import { StyleSheet } from "react-native";
import { Button } from "./Themed";

interface EpisodeTutorialOverlayProps {
  recordingDay: number;
  addEpisode: (episode: Episode) => void;
}

export const EpisodeTutorialOverlay: FunctionComponent<EpisodeTutorialOverlayProps> = ({
  recordingDay,
  addEpisode,
}) => {
  const informationText = [
    "Name your episode",
    "Indicate when the episode started (Start Time) and ended (End Time).",
    "Identify the important or main people that you interacted with, using their initials.",
    'Tap "Add Episode" to add this episode to your today\'s diary.',
  ];
  const [fieldState, setFieldState] = useState(0);
  return (
    <View style={overlayStyles.overlayContainer}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={containerStyles.container}>
          <View style={containerStyles.titleContainer}>
            {/** this is only here to ensure the spacing is consistent */}
            <Text
              style={{
                ...styles.title,
                textAlign: "center",
                width: "100%",
              }}
            >
              {" \n\n"}
              <Text
                style={{
                  ...overlayStyles.textColor,
                  ...styles.inputHeader,
                }}
              >
                {" "}
              </Text>
            </Text>
            <Text
              style={{
                ...styles.inputHeader,
                ...overlayStyles.informationText,
              }}
            >
              {informationText[fieldState]}
            </Text>
          </View>
          <EpisodeInputFields
            recordingDay={recordingDay}
            addEpisode={addEpisode}
            darkMode={true}
            updateState={setFieldState}
            currentState={fieldState}
          >
            <Button
              style={{
                ...styles.button,
                opacity: 0,
              }}
              disabled={true}
            >
              {/** this is only here to ensure the spacing is consistent */}
              <Text style={styles.buttonText}>Confirm episodes</Text>
            </Button>
          </EpisodeInputFields>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

export const overlayStyles = StyleSheet.create({
  overlayContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    backgroundColor: "rgba(15, 52, 51, 0.95)",
  },
  textColor: {
    color: "white",
  },
  informationText: {
    color: "white",
    position: "absolute",
    width: "100%",
    top: 15,
    left: 0,
    textAlign: "center",
  },
});
