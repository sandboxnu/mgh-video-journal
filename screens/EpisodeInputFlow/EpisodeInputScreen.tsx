import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { Keyboard, TouchableWithoutFeedback } from "react-native";
import { Button, Text, View } from "../../components/Themed";
import Icon from "react-native-vector-icons/Octicons";
import { Episode } from "../../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../../utils/AsyncStorageUtils";
import { containerStyles, styles } from "./EpisodeInputCommonStyles";
import { EpisodeInputFields } from "../../components/EpisodeInputFields";
import { EpisodeTutorialOverlay } from "../../components/EpisodeTutorialOverlay";

interface EpisodeInputScreenProps {
  recordingDay: number;
}

export default function EpisodeInputScreen({
  recordingDay,
}: EpisodeInputScreenProps) {
  let navigation = useNavigation();

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [showTutorial, setShowTutorial] = useState(recordingDay === 1);

  const putEpisodesInStorage = async (
    finished: boolean,
    episodes: Episode[]
  ) => {
    await AsyncStorage.setItem(
      STORAGE_KEYS.daysEpisodes(recordingDay),
      JSON.stringify(episodes)
    );
    if (finished) {
      //@ts-ignore
      navigation.replace("EpisodeConfirmation", { episodes, recordingDay });
    }
  };

  const onMount = async () => {
    const todayEpisodes = await AsyncStorage.getItem(
      STORAGE_KEYS.daysEpisodes(recordingDay)
    );
    if (todayEpisodes === null) {
      // if the todaysEpisodes hasn't been set, this is their first time on today so set it
      await AsyncStorage.setItem(
        STORAGE_KEYS.daysEpisodes(recordingDay),
        JSON.stringify([])
      );
    } else {
      // if it isn't their first time on today, they may have some episodes the already entered so add them
      setEpisodes(JSON.parse(todayEpisodes));
    }
  };

  const addEpisode = (episode: Episode) => {
    const newEpisodes = [...episodes, episode];
    setEpisodes(newEpisodes);
    putEpisodesInStorage(false, newEpisodes);
    setShowTutorial(false);
  };

  useEffect(() => {
    onMount();
  }, []);

  return (
    // accessible = false allows the input form continue to be accessible through VoiceOver
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <>
        <View style={containerStyles.container}>
          <View style={containerStyles.titleContainer}>
            <Text style={styles.title}>
              Create an episode{"\n\n"}
              <Text style={styles.inputHeader}>
                Please enter at least two episodes
              </Text>
            </Text>
            <Icon
              name="three-bars"
              size={30}
              color="#000"
              onPress={() => {
                navigation.navigate("EpisodeDisplay", { episodes });
              }}
            />
          </View>
          <EpisodeInputFields
            recordingDay={recordingDay}
            addEpisode={addEpisode}
          >
            <Button
              onPress={() => putEpisodesInStorage(true, episodes)}
              style={{
                ...(episodes.length < 2 ? styles.buttonGrey : styles.buttonRed),
                ...styles.button,
              }}
              disabled={episodes.length < 2}
            >
              <Text style={styles.buttonText}>Confirm episodes</Text>
            </Button>
          </EpisodeInputFields>
        </View>
        {showTutorial && (
          <EpisodeTutorialOverlay
            recordingDay={recordingDay}
            addEpisode={addEpisode}
          />
        )}
      </>
    </TouchableWithoutFeedback>
  );
}
