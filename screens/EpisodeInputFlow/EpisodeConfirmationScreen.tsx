import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { Button, Text, View } from "../../components/Themed";
import { Episode } from "../../types";
import { convertMinutesToTime } from "../../utils/TimeUtils";
import { Ionicons as Icon } from "@expo/vector-icons";
import { continueButtonStyle } from "../../utils/StylingUtils";
import { useMainNavigation } from "../../hooks/useMainNavigation";
import Colors from "../../constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../../utils/AsyncStoageUtils";

interface EpisodeProps {
  episode: Episode;
  index: number;
}

function EditableEpisode({ episode, index }: EpisodeProps) {
  const navigator = useNavigation();
  return (
    <View style={episodeStyles.container}>
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
      <Button style={episodeStyles.editButtonContainer}>
        <Icon
          name="create-outline"
          size={40}
          color="#FFF"
          style={episodeStyles.icon}
          onPress={() => {
            navigator.navigate("EpisodeEdit", { episode, index });
          }}
        />
      </Button>
    </View>
  );
}

const episodeStyles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 10,
    height: 90,
  },
  editButtonContainer: {
    flex: 1,
    backgroundColor: Colors.avocadoGreen,
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    color: "white",
    fontFamily: "Inter_700Bold",
    fontStyle: "normal",
    fontSize: 40,
    lineHeight: 48,
  },
  icon: {
    backgroundColor: Colors.avocadoGreen,
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

interface EpisodeConfirmationProps {
  episodes: Episode[];
  recordingDay: number;
}

export default function EpisodeConfirmationScreen({ route }: any) {
  let mainNavigation = useMainNavigation();

  const { episodes, recordingDay }: EpisodeConfirmationProps = route.params;
  const [state, setState] = useState(0);
  const [currentEpisodes, setCurrentEpisodes] = useState(episodes);

  const setRandomEpisodes = async () => {
    if ((await AsyncStorage.getItem(STORAGE_KEYS.episodeRecall())) === null) {
      const randomEpisodes = selectRandomEpisodes(currentEpisodes);
      await AsyncStorage.setItem(
        STORAGE_KEYS.episodeRecall(),
        JSON.stringify(randomEpisodes)
      );
    }
  };
  const selectRandomEpisodes = (episodes: Episode[]) => {
    const randomEpisodeInx = () => Math.floor(Math.random() * episodes.length);
    const firstElement = randomEpisodeInx();
    let secondElement = randomEpisodeInx();
    while (firstElement === secondElement) {
      secondElement = randomEpisodeInx();
    }
    return [episodes[firstElement], episodes[secondElement]];
  };

  const editEpisode = (newEpisode: Episode, index: number) => {
    currentEpisodes[index] = newEpisode;
    setCurrentEpisodes(currentEpisodes);
    setState(state + 1);
  };
  const { episode, index }: EpisodeProps = route.params;
  useEffect(() => {
    if (episode) editEpisode(episode, index);
  }, [episode]);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Day {recordingDay} Episodes</Text>
        <Text style={styles.infoText}>
          Please double-check that these are the episodes of your day today.
          Please edit any details that are not correct.
        </Text>
      </View>
      <View style={styles.bodyContainer}>
        <ScrollView>
          {currentEpisodes.map((episode: Episode, index: number) => (
            <EditableEpisode
              key={`${episode.name}${index}`}
              episode={episode}
              index={index}
            />
          ))}
        </ScrollView>
      </View>
      <Button
        style={continueButtonStyle(true).style}
        onPress={async () => {
          await AsyncStorage.setItem(
            STORAGE_KEYS.daysEpisodes(recordingDay),
            JSON.stringify(currentEpisodes)
          );
          await setRandomEpisodes();
          mainNavigation.navigate({
            type: "recordEpisodes",
            episodes: currentEpisodes,
          });
        }}
      >
        <Text style={styles.confirmText}>Confirm Episodes</Text>
      </Button>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 30,
    flex: 1,
  },
  titleContainer: {
    marginTop: 40,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  title: {
    fontFamily: "Inter_500Medium",
    fontStyle: "normal",
    fontSize: 30,
    lineHeight: 36,
    textAlign: "left",
    color: Colors.avocadoGreen,
  },
  bodyContainer: {
    flex: 6.75,
    overflow: "scroll",
  },
  infoText: {
    marginVertical: 10,
    fontFamily: "Arimo_400Regular",
    fontStyle: "normal",
    fontSize: 18,
    lineHeight: 26,
    color: Colors.avocadoGreen,
  },
  confirmText: {
    color: "white",
    textAlign: "center",
  },
});
