import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { StyleSheet, TextInput, StyleProp, ViewStyle } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Button, Text, View } from "../components/Themed";
import Icon from "react-native-vector-icons/Octicons";
import { Episode } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../utils/AsyncStoageUtils";

// the length of a day in milliseconds
const DAY_IN_MS = 24 * 60 * 60 * 1000;
const EXACT_DATE = new Date();
// standardized current date that does not factor in the time it was created, just the date
const CURRENT_DATE = new Date(
  EXACT_DATE.getFullYear(),
  EXACT_DATE.getMonth(),
  EXACT_DATE.getDate(),
  0
).toISOString();

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

  const [episodeName, setEpisodeName] = useState("");
  const [initials, setInitials] = useState("");
  const [startTime, setStartTime] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState<Date | undefined>(undefined);

  const [episodes, setEpisodes] = useState<Episode[]>([]);

  let recordingDay: number = 1;

  const putEpisodesInStoage = async () => {
    await AsyncStorage.setItem(
      STORAGE_KEYS.daysEpisodes(recordingDay),
      JSON.stringify(episodes)
    );
  };

  const createEpisode = () => {
    if (validateEpisode()) {
      const newEpisode: Episode = {
        name: episodeName,
        initials,
        startTime: convertToMinutes(startTime!),
        endTime: convertToMinutes(endTime!),
        date: CURRENT_DATE,
        recordingDay,
      };
      episodes.push(newEpisode);
      setEpisodes(episodes);
      putEpisodesInStoage();
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
    const startDay = await AsyncStorage.getItem(STORAGE_KEYS.start_day());
    const todayEpisodes = await AsyncStorage.getItem(
      STORAGE_KEYS.daysEpisodes(recordingDay)
    );
    if (startDay === null) {
      // if the startDay hasn't been set, this is their first time on this page, so set it to the current date
      // current date is only based on year/month/date so the time will always be the same accross days
      await AsyncStorage.setItem(STORAGE_KEYS.start_day(), CURRENT_DATE);
    } else {
      // check which "day" it is for them (day 1, 2, 3) based on the start day.
      // When you subtract them, it should only ever be 0 (same day), DAY_IN_MS (1 day later) or DAY_IN_MS * 2 (2 days later) since
      // current date and start day should always be the same time of day
      const msApart =
        new Date(CURRENT_DATE).getMilliseconds() -
        new Date(startDay).getMilliseconds();
      // Add one so it's standardixed as day 1, 2, or 3
      recordingDay = msApart / DAY_IN_MS + 1;
    }
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
            ...(hasError ? styles.buttonGrey : styles.buttonBlue),
            ...styles.button,
          }}
        >
          <Text style={styles.buttonText}>Add episode</Text>
        </Button>
        <Button
          onPress={putEpisodesInStoage}
          style={{ ...styles.buttonBlue, ...styles.button }}
        >
          <Text style={styles.buttonText}>Confirm episodes</Text>
        </Button>
        <View style={{ flex: 2 }} />
      </View>
    </View>
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
  buttonBlue: {
    backgroundColor: "#0038FF",
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: "Inter_400Regular",
    fontStyle: "normal",
    fontSize: 20,
    lineHeight: 22,
  },
});
