import React, { useState, FunctionComponent } from "react";
import { StyleSheet } from "react-native";
import Colors from "../constants/Colors";
import { Episode } from "../types";
import { convertToLocale } from "../utils/TimeUtils";
import { View, Text } from "./Themed";

interface EpisodeRecallOverlay {
  episode: Episode;
}

export const EpisodeRecallOverlay: FunctionComponent<EpisodeRecallOverlay> = ({
  episode,
}) => {
  return (
    <View style={episodeRecallOverlayStyles.container}>
      <Text style={episodeRecallOverlayStyles.episodeDetailTitle}>Day 1</Text>
      <Text style={episodeRecallOverlayStyles.title}>{episode.name}</Text>
      <View style={episodeRecallOverlayStyles.divider} />
      <View style={episodeRecallOverlayStyles.detailContainer}>
        <Text style={episodeRecallOverlayStyles.episodeDetailTitle}>Time</Text>
        <Text
          style={episodeRecallOverlayStyles.episodeDetails}
        >{`${convertToLocale(episode.startTime)} - ${convertToLocale(
          episode.endTime
        )}`}</Text>
      </View>
      <View style={episodeRecallOverlayStyles.detailContainer}>
        <Text style={episodeRecallOverlayStyles.episodeDetailTitle}>
          Together with
        </Text>
        <Text style={episodeRecallOverlayStyles.episodeDetails}>
          {episode.initials || "N/A"}
        </Text>
      </View>
    </View>
  );
};

const episodeRecallOverlayStyles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    minHeight: "60%",
    width: "100%",
    padding: 30,
    justifyContent: "space-around",
  },
  divider: {
    height: 2,
    backgroundColor: Colors.avocadoGreen,
  },
  title: {
    alignItems: "flex-end",
    fontFamily: "Inter_700Bold",
    fontStyle: "normal",
    fontSize: 40,
    lineHeight: 48,
    color: Colors.avocadoGreen,
  },
  detailContainer: {
    backgroundColor: "transparent",
  },
  episodeDetails: {
    alignItems: "flex-end",
    fontFamily: "Inter_500Medium",
    fontStyle: "normal",
    fontSize: 30,
    lineHeight: 36,
    color: Colors.avocadoGreen,
  },
  episodeDetailTitle: {
    alignItems: "flex-end",
    fontFamily: "Arimo_400Regular",
    fontStyle: "normal",
    fontSize: 18,
    lineHeight: 26,
    color: Colors.avocadoGreen,
  },
});
