import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  StyleProp,
  ViewStyle,
  Keyboard,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Button, Text, View } from "../components/Themed";
import Icon from "react-native-vector-icons/Octicons";
import { Episode } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../utils/AsyncStoageUtils";
import { useMainNavigation } from "../hooks/useMainNavigation";
import { getCurrentDate, retrieveRecordingDay } from "../utils/TimeUtils";
import Colors from "../constants/Colors";
import { TouchableWithoutFeedback } from "react-native";

let recordingDay: number = 1;
const convertToMinutes = (time: Date) => {
  return time.getHours() * 60 + time.getMinutes();
};

interface TimeProps {
  time: Date | undefined;
  setTime: (time: Date | undefined) => void;
  label: string;
  style: StyleProp<ViewStyle>;
}

function TimePicker({ time, setTime, label, style }: TimeProps) {
  const [isVisible, setVisibility] = useState(false);
  const handleConfirm = (
    date: Date | undefined,
    setTime: (time: Date | undefined) => void
  ) => {
    setTime(date);
    hideDatePicker();
  };

  const showDatePicker = () => {
    setVisibility(true);
  };

  const hideDatePicker = () => {
    setVisibility(false);
  };
  return (
    <View style={style}>
      <Button onPress={showDatePicker} style={datePickerStyles.timeButton}>
        <View style={datePickerStyles.contentWrapper}>
          <Text style={datePickerStyles.text}>
            {time
              ? time.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })
              : label}
          </Text>
          <Icon
            name="chevron-down"
            size={20}
            color="#000"
            style={datePickerStyles.icon}
          />
        </View>
      </Button>
      <DateTimePickerModal
        headerTextIOS={`Please enter the episode ${label.toLowerCase()}:`}
        isVisible={isVisible}
        mode="time"
        onConfirm={(date) => handleConfirm(date, setTime)}
        onCancel={hideDatePicker}
      />
    </View>
  );
}

const datePickerStyles = StyleSheet.create({
  timeButton: {
    flex: 1,
    backgroundColor: "transparent",
  },
  contentWrapper: {
    flex: 1,
    marginHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: "auto",
  },
  text: {
    fontFamily: "Arimo_400Regular",
    fontStyle: "normal",
    fontSize: 18,
    lineHeight: 22,
  },
});

export default function EpisodeInputScreen() {
  let navigation = useNavigation();
  let mainNavigation = useMainNavigation();

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
      mainNavigation.navigate({ type: "recordEpisodes", episodes });
      if ((await AsyncStorage.getItem(STORAGE_KEYS.episodeRecall())) === null) {
        const randomEpisodes = selectRandomEpisodes();
        await AsyncStorage.setItem(
          STORAGE_KEYS.episodeRecall(),
          JSON.stringify(randomEpisodes)
        );
      }
    }
  };

  const selectRandomEpisodes = () => {
    const randomEpisodeInx = () => Math.floor(Math.random() * episodes.length);
    const firstElement = randomEpisodeInx();
    let secondElement = randomEpisodeInx();
    while (firstElement === secondElement) {
      secondElement = randomEpisodeInx();
    }
    return [episodes[firstElement], episodes[secondElement]];
  };

  const createEpisode = () => {
    if (validateEpisode()) {
      const newEpisode: Episode = {
        name: episodeName,
        initials,
        startTime: convertToMinutes(startTime!),
        endTime: convertToMinutes(endTime!),
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
          <Text style={styles.title}>Create an episode</Text>
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
            <Text style={styles.inputHeader}>Episode Name</Text>
            <TextInput
              style={{ ...styles.inputContent, ...styles.textInput }}
              maxLength={70}
              onChangeText={setEpisodeName}
              value={episodeName}
              editable
            />
          </View>
          <View style={styles.input}>
            <Text style={styles.inputHeader}>{"Duration"}</Text>
            <View style={{ ...styles.inputContent, ...styles.timePickers }}>
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
              style={{ ...styles.inputContent, ...styles.textInput }}
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
const containerStyles = StyleSheet.create({
  container: {
    padding: 30,
    flex: 1,
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  inputContainer: {
    flex: 4,
    flexDirection: "column",
  },
  buttonsContainer: {
    flex: 3,
    alignContent: "stretch",
  },
});

const styles = StyleSheet.create({
  title: {
    flex: 1,
    fontFamily: "Inter_500Medium",
    fontStyle: "normal",
    fontSize: 30,
    lineHeight: 36,
    textAlign: "left",
  },
  input: {
    flex: 1,
    justifyContent: "center",
    marginTop: "2%",
  },
  inputHeader: {
    flex: 1,
    fontFamily: "Arimo_400Regular",
    fontStyle: "normal",
    fontSize: 18,
    lineHeight: 22,
    marginVertical: "2%",
  },
  inputText: {
    flex: 1,
    fontFamily: "Arimo_400Regular",
    fontStyle: "normal",
    fontSize: 18,
    lineHeight: 22,
    marginVertical: "2%",
  },
  greyText: {
    color: "#9c9c9c",
  },
  inputContent: {
    flex: 2,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#979797",
    borderStyle: "solid",
    fontFamily: "Arimo_400Regular",
    fontStyle: "normal",
    fontSize: 20,
    lineHeight: 22,
    paddingHorizontal: 15,
    color: "#000000",
  },
  timePickers: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timePickerContainer: {
    borderWidth: 1,
    borderColor: "#979797",
    borderStyle: "solid",
    flex: 150,
    width: "45%",
  },
  button: {
    flex: 1,
    marginVertical: "3%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonGrey: {
    backgroundColor: "#8d8d8d",
  },
  buttonRed: {
    backgroundColor: Colors.allowedButtonColor,
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: "Inter_400Regular",
    fontStyle: "normal",
    fontSize: 20,
    lineHeight: 22,
  },
});
