import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { Text, View } from "../components/Themed";
import { Episode } from "../types";

interface EpisodeProps {
  episode: Episode;
  index: number;
}

function EpisodeDisplay({ episode, index }: EpisodeProps) {
  const convertMinutesToTime = (minutes: number) => {
    const date = new Date(minutes * 60 * 1000);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <View style={episodeStyles.container}>
      <View style={episodeStyles.numberContainer}>
        <Text style={episodeStyles.numberText}>{index}</Text>
      </View>
      <View style={episodeStyles.infoContainer}>
        <Text style={episodeStyles.episodeTitleText} numberOfLines={1}>
          {episode.name}
        </Text>
        <Text style={episodeStyles.episodeInfoText}>{`${convertMinutesToTime(
          episode.startTime
        )} - ${convertMinutesToTime(episode.endTime)}`}</Text>
        <Text style={episodeStyles.episodeInfoText} numberOfLines={1}>{`with ${
          episode.initials.trim() || "N/A"
        }`}</Text>
      </View>
    </View>
  );
}

const episodeStyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 20,
    height: 120,
  },
  numberContainer: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  numberText: {
    color: "white",
    fontFamily: "Inter_700Bold",
    fontStyle: "normal",
    fontSize: 40,
    lineHeight: 48,
  },
  infoContainer: {
    flex: 3,
    backgroundColor: "#EBEBEB",
    justifyContent: "center",
    padding: 20,
  },
  episodeTitleText: {
    fontFamily: "Arimo_700Bold",
    fontStyle: "normal",
    fontSize: 18,
    lineHeight: 22,
    marginBottom: 5,
  },
  episodeInfoText: {
    fontFamily: "Arimo_400Regular",
    fontStyle: "normal",
    fontSize: 18,
    lineHeight: 22,
  },
});

export default function EpisodeDisplayScreen({ route }: any) {
  let navigation = useNavigation();
  const { episodes } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Current episodes</Text>
      </View>
      <View style={{ flex: 0.25 }} />
      <View style={styles.bodyContainer}>
        {episodes.length === 0 && (
          <Text style={styles.noneText}>No episodes yet. Go add some!</Text>
        )}
        <ScrollView>
          {episodes.map((episode: Episode, index: number) => (
            <EpisodeDisplay
              key={`${episode.name}${index}`}
              episode={episode}
              index={index + 1}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 30,
    flex: 1,
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  title: {
    flex: 1,
    fontFamily: "Inter_500Medium",
    fontStyle: "normal",
    fontSize: 30,
    lineHeight: 36,
    textAlign: "left",
  },
  bodyContainer: {
    flex: 6.75,
    overflow: "scroll",
  },
  noneText: {
    fontFamily: "Arimo_700Bold",
    fontStyle: "normal",
    fontSize: 18,
    lineHeight: 22,
  },
});
