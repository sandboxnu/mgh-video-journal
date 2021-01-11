import React, { FunctionComponent, useEffect, useState } from "react";
import { View, Text, Button } from "../components/Themed";
import { StyleSheet } from "react-native";
import { continueButtonStyle } from "../utils/StylingUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../utils/AsyncStorageUtils";
import { useMainNavigation } from "../hooks/useMainNavigation";
import Colors from "../constants/Colors";

function EvenSpacedView() {
  return <View style={{ flex: 1, backgroundColor: "transparent" }} />;
}

export const EpisodeRecallOverview: FunctionComponent = () => {
  const [episodes, setEpisodes] = useState([]);

  const navigation = useMainNavigation();

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.episodeRecall()).then((episodes) => {
      if (episodes) {
        setEpisodes(JSON.parse(episodes));
      }
    });
  }, []);

  return (
    <View style={EpisodeRecallOverviewStyles.container}>
      <View style={EpisodeRecallOverviewStyles.titleView}>
        <EvenSpacedView />
        <Text style={EpisodeRecallOverviewStyles.title}>Episode Recall</Text>
      </View>
      <Text style={EpisodeRecallOverviewStyles.subtext}>
        Now we are going to select two Episodes from Day 1 for you to recall in
        detail. {"\n\n"}
        As before every recording, we will first make sure your face is visible
        in the window. {"\n\n"}
        Then on the following screen, we will tell you which Episode we would
        like you to do another recording for.
      </Text>
      <Button
        style={continueButtonStyle(true).style}
        onPress={() => {
          navigation.navigate({ type: "episodeRecall", episodes });
        }}
      >
        <Text style={EpisodeRecallOverviewStyles.buttonText}>Get Started!</Text>
      </Button>
    </View>
  );
};

const EpisodeRecallOverviewStyles = StyleSheet.create({
  titleView: {
    flex: 1,
    margin: 0,
    padding: 0,
    backgroundColor: "transparent",
  },
  title: {
    fontFamily: "Inter_700Bold",
    flex: 1,
    fontSize: 40,
    textAlign: "left",
    color: "white",
  },
  container: {
    flex: 1,
    paddingTop: 25,
    paddingRight: 24,
    paddingLeft: 24,
    paddingBottom: 25,
    justifyContent: "flex-start",
    backgroundColor: Colors.avocadoGreen,
  },
  subtext: {
    flex: 5,
    fontFamily: "Inter_400Regular",
    fontSize: 18,
    color: "white",
  },
  button: {
    ...continueButtonStyle(true).style,
    maxHeight: 60,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
});
