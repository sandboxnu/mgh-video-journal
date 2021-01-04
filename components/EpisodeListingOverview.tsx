import React, { useState, FunctionComponent } from "react";
import { StyleSheet } from "react-native";
import { View, Text } from "./Themed";

export const EpisodeListingOverview: FunctionComponent = () => {
  return (
    <View style={episodeListingStyles.container}>
      <Text style={episodeListingStyles.title}>Great!</Text>
      <Text style={episodeListingStyles.subheader}>Let’s start recording</Text>
      <Text style={episodeListingStyles.text}>
        For this first recording, we would like you to please tell us the names
        of all of your Episodes from Day 1. {"\n\n"}If you cannot remember the
        exact title, you can try to identify the episode by a short, few word
        description. {"\n\n"}
        <Text style={episodeListingStyles.doNot}>Do not</Text> tell us any
        episodes from today, only from Day 1.
      </Text>
    </View>
  );
};

const episodeListingStyles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    minHeight: "60%",
    width: "100%",
    padding: 20,
    justifyContent: "space-around",
  },
  title: {
    alignItems: "flex-end",
    fontFamily: "Inter_700Bold",
    fontStyle: "normal",
    fontSize: 40,
    lineHeight: 48,
    color: "#FFFFFF",
  },
  subheader: {
    alignItems: "flex-end",
    fontFamily: "Inter_500Medium",
    fontStyle: "normal",
    fontSize: 30,
    lineHeight: 36,
    color: "#FFFFFF",
  },
  text: {
    alignItems: "flex-end",
    fontFamily: "Arimo_400Regular",
    fontStyle: "normal",
    fontSize: 18,
    lineHeight: 26,
    color: "#FFFFFF",
  },
  doNot: {
    alignItems: "flex-end",
    fontFamily: "Arimo_700Bold",
    fontStyle: "normal",
    fontSize: 18,
    lineHeight: 26,
    color: "#FFFFFF",
  },
});
