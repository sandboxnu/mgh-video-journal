import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { TextInput } from "react-native";
import { Button, Text, View } from "../../components/Themed";
import { Episode } from "../../types";
import { getCurrentDate } from "../../utils/TimeUtils";
import { TimePicker } from "../../components/TimePicker";
import { containerStyles, styles } from "./EpisodeInputCommonStyles";

let recordingDay: number = 1;

interface EpisodeEditProps {
  episode: Episode;
  index: number;
}

export default function EpisodeEditScreen({ route }: any) {
  const { episode, index }: EpisodeEditProps = route.params;

  let navigation = useNavigation();

  const [episodeName, setEpisodeName] = useState(episode.name);
  const [initials, setInitials] = useState(episode.initials);
  const [startTime, setStartTime] = useState<Date | undefined>(
    new Date(episode.startTime)
  );
  const [endTime, setEndTime] = useState<Date | undefined>(
    new Date(episode.endTime)
  );

  const saveEpisode = () => {
    if (validateEpisode()) {
      const newEpisode: Episode = {
        name: episodeName,
        initials,
        startTime: startTime!.toISOString(),
        endTime: endTime!.toISOString(),
        date: getCurrentDate().toISOString(),
        recordingDay,
      };
      navigation.navigate("EpisodeConfirmation", {
        episode: newEpisode,
        index,
      });
    }
  };

  const validateEpisode = () => {
    return (
      episodeName !== "" && startTime !== undefined && endTime !== undefined
    );
  };

  const hasError = !validateEpisode();

  return (
    <View style={containerStyles.container}>
      <View style={containerStyles.titleContainer}>
        <Text style={styles.title}>Edit an episode</Text>
      </View>
      <View style={containerStyles.inputContainer}>
        <View style={styles.input}>
          <Text style={styles.inputHeader}>Episode title</Text>
          <TextInput
            style={{ ...styles.textInput }}
            maxLength={70}
            onChangeText={setEpisodeName}
            value={episodeName}
            editable
          />
        </View>
        <View style={styles.input}>
          <Text style={styles.inputHeader}>{"Duration"}</Text>
          <View style={{ ...styles.timePickers }}>
            <TimePicker
              style={styles.timePickerContainer}
              time={startTime}
              label="Start time"
              setTime={setStartTime}
            />
            <View style={{ flex: 10 }} />
            <TimePicker
              style={styles.timePickerContainer}
              time={endTime}
              label="End time"
              setTime={setEndTime}
            />
          </View>
        </View>
        <View style={styles.input}>
          <Text style={styles.inputText}>
            Persons involved{" "}
            <Text style={{ ...styles.inputText, ...styles.greyText }}>
              (Optional)
            </Text>
          </Text>
          <TextInput
            style={{ ...styles.textInput }}
            maxLength={70}
            onChangeText={setInitials}
            value={initials}
            editable
          />
        </View>
      </View>
      <View style={containerStyles.buttonsContainer}>
        <Button
          disabled={!!hasError}
          onPress={hasError ? () => {} : saveEpisode}
          style={{
            ...(hasError ? styles.buttonGrey : styles.buttonRed),
            ...styles.button,
          }}
        >
          <Text style={styles.buttonText}>Save Changes</Text>
        </Button>
      </View>
    </View>
  );
}
