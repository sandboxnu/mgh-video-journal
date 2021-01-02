import React, { FunctionComponent, useState } from "react";
import { ScrollView, StyleSheet, TextInput } from "react-native";
import { View, Text, Button } from "../components/Themed";
import Colors from "../constants/Colors";

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
        staff member here or by phone at 978 435 2207. {"\n\n"}
        Thank you again for taking the time to participate in our study. We know
        your time is valuable and we are grateful for your contributions to
        science. {"\n\n"}
        You are now done for the day. We will see you again tomorrow!
      </Text>
    </View>
  );
};

const EpisodePredictionWrapper: FunctionComponent = () => {
  const [allAdded, setAllAdded] = useState(false);

  return !allAdded ? (
    <EpisodePrediction onFinish={() => setAllAdded(true)} />
  ) : (
    <ThankYouScreen />
  );
};

interface EpisodePredictionProps {
  onFinish: () => void;
}

const EpisodePrediction: FunctionComponent<EpisodePredictionProps> = ({
  onFinish,
}) => {
  const [predictions, setPredictions] = useState<string[]>([]);
  const [hasOneValue, setHasOneValue] = useState(false);
  return (
    <View style={styles.container}>
      <Text style={styles.header}>You are almost done!</Text>
      <Text style={styles.subheader}>
        Before you finish we would like you to tell us what you think your
        episodes for tomorrow (Day 2) will be.
      </Text>
      <View style={{ flex: 7 }}>
        <ScrollView style={styles.scrollView}>
          {predictions.map((val, idx) => (
            <TextInput
              style={styles.textInput}
              key={idx}
              defaultValue={val}
              placeholder="Enter episode title"
              placeholderTextColor={styles.addEpisodeText.color}
              onChangeText={(t) => {
                predictions[idx] = t;
                setPredictions(predictions);
                setHasOneValue(predictions.some((val) => val !== ""));
              }}
            />
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
        onPress={() => {
          // Will follow with saving the predictions when the saving gets started in the episode recording
          onFinish();
        }}
      >
        <Text style={styles.continueText}>Continue</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
    justifyContent: "space-between",
    paddingRight: 24,
    paddingLeft: 24,
    paddingBottom: 25,
  },
  header: {
    flex: 1,
    fontSize: 30,
    paddingTop: 20,
  },
  subheader: {
    flex: 1,
    fontSize: 18,
  },
  scrollView: {
    marginTop: 5,
    marginBottom: 5,
  },
  textInput: {
    borderColor: "#000",
    borderWidth: 1,
    textAlign: "center",
    height: 52,
    marginBottom: 10,
  },
  addEpisodeButton: {
    height: 52,
    borderColor: "#9C9C9C",
    borderWidth: 1,
    borderStyle: "dashed",
    backgroundColor: "white",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "stretch",
  },
  addEpisodeText: {
    flex: 1,
    color: "#9C9C9C",
    textAlign: "center",
  },
  continueText: {
    color: "white",
    textAlign: "center",
  },
});

const continueButtonStyle = (hasOneValue: boolean) => ({
  style: {
    backgroundColor: hasOneValue
      ? Colors.allowedButtonColor
      : Colors.disabledButtonColor,
    flex: 1,
    color: "white",
    justifyContent: "center",
    alignItems: "stretch",
    maxHeight: 60,
  } as const,
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
  },
  container: {
    ...styles.container,
    justifyContent: "flex-start",
  },
  subtext: {
    flex: 5,
    fontWeight: "400",
    fontSize: 18,
  },
  button: {
    ...continueButtonStyle(true).style,
    maxHeight: 60,
  },
});

export default EpisodePredictionWrapper;
