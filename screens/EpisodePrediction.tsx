import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import React, { FunctionComponent, useRef, useState } from "react";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { uploadJSONToFirebase } from "../clients/firebaseInteractor";
import { View, Text, Button } from "../components/Themed";
import Colors from "../constants/Colors";
import { continueButtonStyle } from "../utils/StylingUtils";
import { STORAGE_KEYS } from "../utils/AsyncStorageUtils";
import { useMainNavigation } from "../hooks/useMainNavigation";
import { EvenSpacedView } from "../components/EvenSpacedView";

interface EpisodePredictionWrapperProps {
  recordingDay: number;
  participantId: string;
}

const EpisodePredictionWrapper: FunctionComponent<EpisodePredictionWrapperProps> = ({
  recordingDay,
  participantId,
}) => {
  const [allAdded, setAllAdded] = useState(false);
  const [predictions, setPredictions] = useState<string[]>([]);
  const hasUploadedRef = useRef(false);
  const [submitting, setSubmitting] = useState(false);

  const navigation = useMainNavigation();

  // upload the data, but only do it once. keep track using a ref
  // this will upload immediately on day 3 (no predictions), or wait for allAdded on day1/2
  const shouldUpload = !(
    (recordingDay === 1 || recordingDay === 2) &&
    !allAdded
  );
  if (shouldUpload && !hasUploadedRef.current) {
    hasUploadedRef.current = true;
    setSubmitting(true);
    uploadEpisodeInfo(participantId, recordingDay, predictions);
    setSubmitting(false);
    navigation.navigate({ type: "thankYou", recordingDay });
  }

  return (
    <EpisodePrediction
      onFinish={() => setAllAdded(true)}
      predictions={predictions}
      setPredictions={setPredictions}
      loading={submitting}
      recordingDay={recordingDay}
    />
  );
};

export const uploadEpisodeInfo = async (
  participantId: string,
  recordingDay: number,
  predictions: string[] = []
): Promise<void> => {
  const fileName = `${participantId}/${participantId}_Day${recordingDay}_${new Date()
    .toDateString()
    .replaceAll(" ", "_")}.json`;

  let createdEpisodes = JSON.parse(
    (await AsyncStorage.getItem(STORAGE_KEYS.daysEpisodes(recordingDay)))!
  );

  await uploadJSONToFirebase(fileName, {
    createdEpisodes,
    predictedEpisodes: predictions,
  });
};

interface EpisodePredictionProps {
  onFinish: () => void;
  predictions: string[];
  setPredictions: (predictions: string[]) => void;
  loading: boolean;
  recordingDay: number;
}

const EpisodePrediction: FunctionComponent<EpisodePredictionProps> = ({
  recordingDay,
  onFinish,
  predictions,
  loading,
  setPredictions,
}) => {
  const [hasOneValue, setHasOneValue] = useState(false);
  return (
    // accessible = false allows the input form continue to be accessible through VoiceOver
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.header}>You are almost done!</Text>
        <Text style={styles.subheader}>
          Before you finish we would like you to tell us what you think your
          episodes for tomorrow (Day {recordingDay + 1}) will be.
        </Text>
        <View style={{ flex: 7 }}>
          <ScrollView style={styles.scrollView}>
            {predictions.map((val, idx) => (
              <View style={styles.textInputWrapper} key={idx}>
                <TextInput
                  style={styles.textInput}
                  defaultValue={val}
                  placeholder="Enter episode title"
                  placeholderTextColor={styles.addEpisodeText.color}
                  onChangeText={(t) => {
                    const newPredictions = predictions.map((e, i) =>
                      i !== idx ? e : t
                    );
                    setPredictions(newPredictions);
                    setHasOneValue(newPredictions.some((val) => val !== ""));
                  }}
                />
                <Ionicons
                  name="add"
                  style={styles.icon}
                  color={Colors.avocadoGreen}
                  size={25}
                  onPress={() => {
                    const newPredictions = predictions.filter(
                      (_, index) => index !== idx
                    );
                    setPredictions(newPredictions);
                    setHasOneValue(newPredictions.some((val) => val !== ""));
                  }}
                />
              </View>
            ))}
            <Button
              style={styles.addEpisodeButton}
              onPress={() => {
                setPredictions(predictions.concat([""]));
              }}
            >
              <EvenSpacedView />
              <Text style={styles.addEpisodeText}>+ Add Episode</Text>
              <EvenSpacedView />
            </Button>
          </ScrollView>
        </View>
        <Button
          style={continueButtonStyle(hasOneValue).style}
          disabled={!hasOneValue || loading}
          onPress={onFinish}
        >
          <Text style={styles.continueText}>Continue</Text>
        </Button>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    justifyContent: "space-around",
    paddingRight: 24,
    paddingLeft: 24,
    paddingBottom: 25,
  },
  header: {
    fontSize: 30,
    paddingTop: 20,
    color: Colors.avocadoGreen,
    fontFamily: "Arimo_400Regular",
    paddingBottom: 15,
  },
  subheader: {
    fontSize: 18,
    color: Colors.avocadoGreen,
    fontFamily: "Arimo_400Regular",
    paddingBottom: 20,
  },
  scrollView: {
    marginTop: 5,
    marginBottom: 5,
  },
  textInput: {
    textAlign: "left",
    paddingLeft: 15,
    fontFamily: "Arimo_400Regular",
    fontSize: 18,
    color: Colors.avocadoGreen,
    flex: 1,
  },
  textInputWrapper: {
    borderColor: Colors.textInputBorder,
    borderWidth: 1,
    borderRadius: 10,
    height: 52,
    marginBottom: 10,
    backgroundColor: Colors.textInputFill,
    justifyContent: "space-between",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  addEpisodeButton: {
    height: 52,
    borderColor: Colors.textInputBorder,
    borderWidth: 1,
    borderStyle: "dashed",
    backgroundColor: "white",
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Arimo_400Regular",
  },
  addEpisodeText: {
    flex: 1,
    color: Colors.textInputBorder,
    textAlign: "center",
  },
  continueText: {
    color: "white",
    textAlign: "center",
  },
  icon: {
    transform: [{ rotate: "45deg" }],
    marginHorizontal: 10,
  },
});

const FinalScreen = () => {
  return (
    <View style={FinalScreenStyles.container}>
      <Text style={FinalScreenStyles.text}>
        Your diary for today has been saved! {"\n\n"} You may now exit the
        application.
      </Text>
    </View>
  );
};

const FinalScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.avocadoGreen,
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 18,
    fontFamily: "Arimo_400Regular",
    textAlign: "center",
  },
});

export default EpisodePredictionWrapper;
