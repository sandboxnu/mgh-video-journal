import React, { FunctionComponent, useEffect, useState } from "react";
import { View, Text, Button } from "../components/Themed";
import { StyleSheet } from "react-native";
import { continueButtonStyle } from "../utils/StylingUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../utils/AsyncStoageUtils";
import { useMainNavigation } from "../hooks/useMainNavigation";

function EvenSpacedView() {
  return <View style={{ flex: 1 }} />;
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
        <Text style={EpisodeRecallOverviewStyles.title}>Episode recall!</Text>
      </View>
      {/** TODO: USE REAL PEOPLE WORDS */}
      <Text style={EpisodeRecallOverviewStyles.subtext}>
        Recall some episodes {"\n\n"}
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
  },
  title: {
    fontWeight: "700",
    flex: 1,
    fontSize: 40,
    textAlign: "left",
  },
  container: {
    flex: 1,
    paddingTop: 25,
    paddingRight: 24,
    paddingLeft: 24,
    paddingBottom: 25,
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
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
});
