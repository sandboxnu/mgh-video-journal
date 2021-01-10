import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { TextInput, Keyboard } from "react-native";
import { Button, Text, View } from "../../components/Themed";
import Icon from "react-native-vector-icons/Octicons";
import { Episode } from "../../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../../utils/AsyncStoageUtils";
import { getCurrentDate, retrieveRecordingDay } from "../../utils/TimeUtils";
import { TouchableWithoutFeedback } from "react-native";
import { TimePicker } from "../../components/TimePicker";
import { containerStyles, styles } from "./EpisodeInputCommonStyles";

let recordingDay: number = 1;

export default function EpisodeInputScreen() {
  let navigation = useNavigation();

  const [episodeName, setEpisodeName] = useState("");
  const [initials, setInitials] = useState("");
  const [startTime, setStartTime] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState<Date | undefined>(undefined);

  const [episodes, setEpisodes] = useState<Episode[]>([]);

  const putEpisodesInStorage = async (finished: boolean) => {
    await AsyncStorage.setItem(
      STORAGE_KEYS.daysEpisodes(recordingDay),
      JSON.stringify(episodes)
    );
    if (finished) {
      //@ts-ignore
      navigation.replace("EpisodeConfirmation", { episodes, recordingDay });
    }
  };

  const createEpisode = () => {
    if (validateEpisode()) {
      const newEpisode: Episode = {
        name: episodeName,
        initials,
        startTime: startTime!.toISOString(),
        endTime: endTime!.toISOString(),
        date: getCurrentDate(),
        recordingDay,
      };
      episodes.push(newEpisode);
      setEpisodes(episodes);
      putEpisodesInStorage(false);
      resetEpisodeInput();
    }
  };

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

  const hasError = !validateEpisode();
  const onMount = async () => {
    recordingDay = await retrieveRecordingDay();
    const todayEpisodes = await AsyncStorage.getItem(
      STORAGE_KEYS.daysEpisodes(recordingDay)
    );
    if (todayEpisodes === null) {
      // if the todaysEpisodes hasn't been set, this is their first time on today so set it
      await AsyncStorage.setItem(
        STORAGE_KEYS.daysEpisodes(recordingDay),
        JSON.stringify([])
      );
    } else {
      // if it isn't their first time on today, they may have some episodes the already entered so add them
      setEpisodes(JSON.parse(todayEpisodes));
    }
  };

  useEffect(() => {
    onMount();
  }, []);

  return (
    // accessible = false allows the input form continue to be accessible through VoiceOver
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={containerStyles.container}>
        <View style={containerStyles.titleContainer}>
          <Text style={styles.title}>
            Create an episode{"\n\n"}
            <Text style={styles.inputHeader}>
              Please enter at least two episodes
            </Text>{" "}
          </Text>
          <Icon
            name="three-bars"
            size={30}
            color="#000"
            onPress={() => {
              navigation.navigate("EpisodeDisplay", { episodes });
            }}
          />
        </View>
        <View style={containerStyles.inputContainer}>
          <View style={{ flex: 0.5 }} />
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
          <View style={{ flex: 0.5 }} />
        </View>
        <View style={containerStyles.buttonsContainer}>
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
          <Button
            onPress={() => putEpisodesInStorage(true)}
            style={{
              ...(episodes.length < 2 ? styles.buttonGrey : styles.buttonRed),
              ...styles.button,
            }}
            disabled={episodes.length < 2}
          >
            <Text style={styles.buttonText}>Confirm episodes</Text>
          </Button>
          <View style={{ flex: 2 }} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
