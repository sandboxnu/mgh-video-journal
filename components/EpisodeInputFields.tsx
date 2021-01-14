import React, { useState, FunctionComponent } from "react";
import { TextInput, View } from "react-native";
import { Button, Text } from "./Themed";
import { TimePicker } from "./TimePicker";
import { Episode } from "../types";
import { getCurrentDate } from "../utils/TimeUtils";
import {
  containerStyles,
  styles,
} from "../screens/EpisodeInputFlow/EpisodeInputCommonStyles";

interface EpisodeInputFieldsProps {
  recordingDay: number;
  addEpisode: (episode: Episode) => void;
  darkMode?: boolean;
  updateState?: (state: number) => void;
  currentState?: number;
}

export const EpisodeInputFields: FunctionComponent<EpisodeInputFieldsProps> = ({
  recordingDay,
  addEpisode,
  darkMode,
  updateState,
  currentState,
  children,
}) => {
  const [episodeName, setEpisodeName] = useState("");
  const [initials, setInitials] = useState("");
  const [startTime, setStartTime] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState<Date | undefined>(undefined);
  const createEpisode = () => {
    if (validateEpisode()) {
      const newEpisode: Episode = {
        name: episodeName,
        initials,
        startTime: startTime!.toISOString(),
        endTime: endTime!.toISOString(),
        date: getCurrentDate().toISOString(),
        recordingDay,
      };

      addEpisode(newEpisode);
      resetEpisodeInput();
    }
  };

  const textColorChange = darkMode ? { color: "white" } : {};

  const resetEpisodeInput = () => {
    setEpisodeName("");
    setInitials("");
    setStartTime(undefined);
    setEndTime(undefined);
  };

  const validateEpisode = () => {
    return (
      episodeName !== "" && startTime !== undefined && endTime !== undefined
    );
  };
  const checkAndUpdateState = (newState: number) => {
    if (updateState && currentState !== undefined)
      updateState(Math.max(newState, currentState));
  };

  const stateOpacity = (value: number) =>
    currentState !== undefined && currentState < value ? 0 : 100;

  const hasError = !validateEpisode();
  return (
    <>
      <View style={containerStyles.inputContainer}>
        <View style={{ flex: 0.5 }} />
        <View style={styles.input}>
          <Text style={{ ...textColorChange, ...styles.inputHeader }}>
            Episode title
          </Text>
          <TextInput
            style={{ ...styles.textInput }}
            maxLength={70}
            onChangeText={setEpisodeName}
            value={episodeName}
            editable
            onEndEditing={() => checkAndUpdateState(1)}
          />
        </View>
        <View
          style={{
            ...styles.input,
            opacity: stateOpacity(1),
          }}
          pointerEvents={stateOpacity(1) === 100 ? "auto" : "none"}
        >
          <Text style={{ ...textColorChange, ...styles.inputHeader }}>
            {"Duration"}
          </Text>
          <View
            style={{
              ...styles.timePickers,
            }}
          >
            <TimePicker
              style={styles.timePickerContainer}
              time={startTime}
              label="Start time"
              setTime={(time) => {
                setStartTime(time);
                endTime && checkAndUpdateState(2);
              }}
            />
            <View style={{ flex: 10 }} />
            <TimePicker
              style={styles.timePickerContainer}
              time={endTime}
              label="End time"
              setTime={(time) => {
                setEndTime(time);
                startTime && checkAndUpdateState(2);
              }}
            />
          </View>
        </View>
        <View
          style={{
            ...styles.input,
            opacity: stateOpacity(2),
          }}
          pointerEvents={stateOpacity(2) === 100 ? "auto" : "none"}
        >
          <Text style={{ ...textColorChange, ...styles.inputHeader }}>
            Persons involved{" "}
            <Text
              style={{
                ...styles.greyText,
                ...textColorChange,
              }}
            >
              (optional)
            </Text>
          </Text>
          <TextInput
            style={{ ...styles.textInput }}
            maxLength={70}
            onChangeText={setInitials}
            value={initials}
            editable
            onEndEditing={() => checkAndUpdateState(3)}
          />
        </View>
        <View style={{ flex: 0.5 }} />
      </View>
      <View
        style={{
          ...containerStyles.buttonsContainer,
          opacity: stateOpacity(3),
        }}
        pointerEvents={stateOpacity(3) === 100 ? "auto" : "none"}
      >
        <Button
          disabled={!!hasError}
          onPress={hasError ? () => {} : createEpisode}
          style={{
            ...(hasError ? styles.buttonGrey : styles.buttonRed),
            ...styles.button,
          }}
        >
          <Text style={styles.buttonText}>Add episode</Text>
        </Button>
        {children}
      </View>
      <View style={{ flex: 2 }} />
    </>
  );
};
