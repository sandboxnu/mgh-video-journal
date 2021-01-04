import React, { useState, FunctionComponent } from "react";
import { StyleSheet } from "react-native";
import { Episode } from "../types";
import { convertMinutesToTime } from "../utils/TimeUtils";
import { View, Text } from "./Themed";

interface EpisodeOverlayProps {
  episode: Episode;
  index: number;
}

export const EpisodeOverlay: FunctionComponent<EpisodeOverlayProps> = ({
  episode,
  index,
}) => {
  return (
    <View style={episodeOverlayStyles.container}>
      <Text style={episodeOverlayStyles.title}>Episode {index + 1}</Text>
      <View style={episodeOverlayStyles.divider} />
      <View style={episodeOverlayStyles.detailContainer}>
        <Text style={episodeOverlayStyles.episodeDetailTitle}>Title</Text>
        <Text style={episodeOverlayStyles.episodeDetails}>{episode.name}</Text>
      </View>
      <View style={episodeOverlayStyles.detailContainer}>
        <Text style={episodeOverlayStyles.episodeDetailTitle}>Time</Text>
        <Text
          style={episodeOverlayStyles.episodeDetails}
        >{`${convertMinutesToTime(episode.startTime)} - ${convertMinutesToTime(
          episode.endTime
        )}`}</Text>
      </View>
      <View style={episodeOverlayStyles.detailContainer}>
        <Text style={episodeOverlayStyles.episodeDetailTitle}>
          Together with
        </Text>
        <Text style={episodeOverlayStyles.episodeDetails}>
          {episode.initials || "N/A"}
        </Text>
      </View>
    </View>
  );
};

const episodeOverlayStyles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    minHeight: "60%",
    width: "100%",
    padding: 30,
    justifyContent: "space-around",
  },
  divider: {
    height: 2,
    backgroundColor: "white",
  },
  title: {
    alignItems: "flex-end",
    fontFamily: "Inter_700Bold",
    fontStyle: "normal",
    fontSize: 40,
    lineHeight: 48,
    color: "#FFFFFF",
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
    color: "#FFFFFF",
  },
  episodeDetailTitle: {
    alignItems: "flex-end",
    fontFamily: "Arimo_400Regular",
    fontStyle: "normal",
    fontSize: 18,
    lineHeight: 26,
    color: "#FFFFFF",
  },
});
