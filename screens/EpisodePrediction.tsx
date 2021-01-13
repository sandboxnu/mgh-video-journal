import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import React, { FunctionComponent, useState } from "react";
import {
  Linking,
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
import Contact from "../constants/Contact";
import { STORAGE_KEYS } from "../utils/AsyncStorageUtils";

function EvenSpacedView() {
  return <View style={{ flex: 1 }} />;
}

const ThankYouScreen: FunctionComponent = () => {
  return (
    <View style={ThankYouScreenStyles.container}>
      <View style={ThankYouScreenStyles.titleView}>
        <EvenSpacedView />
        <Text style={ThankYouScreenStyles.title}> Thank you!</Text>
      </View>

      <Text style={ThankYouScreenStyles.subtext}>
        Thank you for completing Day 1 of your Video Diary! Tomorrow you will
        complete Day 2. {"\n\n"}
        Remember, if you have questions or concerns, please contact a research
        staff member{" "}
        <Text
          style={ThankYouScreenStyles.bodyLink}
          onPress={() => Linking.openURL(Contact.contactLink)}
        >
          here
        </Text>{" "}
        or by phone at{" "}
        <Text
          style={ThankYouScreenStyles.bodyContact}
          onPress={() => Linking.openURL(`tel:${Contact.contactPhone}`)}
        >
          {Contact.contactPhone}
        </Text>
        . {"\n\n"}
        Thank you again for taking the time to participate in our study. We know
        your time is valuable and we are grateful for your contributions to
        science. {"\n\n"}
        You are now done for the day. We will see you again tomorrow!
      </Text>
    </View>
  );
};

interface EpisodePredictionWrapperProps {
  recordingDay: number;
  participantId: string;
}

const EpisodePredictionWrapper: FunctionComponent<EpisodePredictionWrapperProps> = ({
  recordingDay,
  participantId,
}) => {
  const [allAdded, setAllAdded] = useState(false);

  return !allAdded ? (
    <EpisodePrediction
      onFinish={() => setAllAdded(true)}
      recordingDay={recordingDay}
      participantId={participantId}
    />
  ) : (
    <ThankYouScreen />
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

  uploadJSONToFirebase(fileName, {
    createdEpisodes,
    predictedEpisodes: predictions,
  });
};

interface EpisodePredictionProps {
  onFinish: () => void;
  recordingDay: number;
  participantId: string;
}

const EpisodePrediction: FunctionComponent<EpisodePredictionProps> = ({
  onFinish,
  recordingDay,
  participantId,
}) => {
  const [predictions, setPredictions] = useState<string[]>([]);
  const [hasOneValue, setHasOneValue] = useState(false);
  return (
    // accessible = false allows the input form continue to be accessible through VoiceOver
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.header}>You are almost done!</Text>
        <Text style={styles.subheader}>
          Before you finish we would like you to tell us what you think your
          episodes for tomorrow (Day 2) will be.
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
                    predictions[idx] = t;
                    setPredictions(predictions);
                    setHasOneValue(predictions.some((val) => val !== ""));
                  }}
                />
                <Ionicons
                  name="add"
                  style={styles.icon}
                  color={Colors.avocadoGreen}
                  size={25}
                  onPress={() => {
                    predictions.splice(idx, 1);
                    setPredictions(predictions);
                    setHasOneValue(predictions.some((val) => val !== ""));
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
          disabled={!hasOneValue}
          onPress={async () => {
            uploadEpisodeInfo(participantId, recordingDay, predictions);
            onFinish();
          }}
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

const ThankYouScreenStyles = StyleSheet.create({
  titleView: {
    flex: 1,
    margin: 0,
    padding: 0,
  },
  title: {
    fontWeight: "700",
    flex: 1,
    fontSize: 40,
    textAlign: "left",
    color: Colors.avocadoGreen,
    fontFamily: "Arimo_700Bold",
    lineHeight: 48.4,
  },
  container: {
    ...styles.container,
    justifyContent: "flex-start",
  },
  subtext: {
    flex: 5,
    fontWeight: "400",
    fontSize: 18,
    fontFamily: "Arimo_400Regular",
    color: Colors.avocadoGreen,
  },
  button: {
    ...continueButtonStyle(true).style,
    maxHeight: 60,
  },
  bodyContact: {
    color: Colors.linkOrange,
  },
  bodyLink: {
    color: Colors.linkOrange,
    textDecorationLine: "underline",
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
