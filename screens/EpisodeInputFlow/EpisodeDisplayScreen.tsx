import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Animated,
  TouchableOpacity,
} from "react-native";
import { Text, View } from "../../components/Themed";
import { Episode } from "../../types";
import { convertToLocale } from "../../utils/TimeUtils";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../../utils/AsyncStorageUtils";
import { useNavigation } from "@react-navigation/native";

interface EpisodeProps {
  episode: Episode;
  index: number;
  deleteCallback: () => void;
}

function EpisodeDisplay({ episode, index, deleteCallback }: EpisodeProps) {
  const [clicked, setClicked] = useState(false);
  const { width } = useWindowDimensions();
  const offset = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  // animate the sliding delete button
  useEffect(() => {
    const toValue = clicked ? -width + 60 : 0;
    Animated.timing(offset, {
      toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [clicked, offset]);

  // whenever clicked is true, set it back to false after 2 seconds
  useEffect(() => {
    if (clicked) {
      const callback = window.setTimeout(() => {
        setClicked(false);
      }, 2000);
      return () => window.clearTimeout(callback);
    }
  }, [clicked]);

  return (
    <Animated.View
      style={{
        flexDirection: "row",
        transform: [
          {
            translateX: offset,
          },
        ],
      }}
    >
      <View style={episodeStyles.container}>
        <View style={episodeStyles.numberContainer}>
          <Text style={episodeStyles.numberText}>{index}</Text>
        </View>
        <View style={episodeStyles.infoContainer}>
          <Text style={episodeStyles.episodeTitleText} numberOfLines={1}>
            {episode.name}
          </Text>
          <Text style={episodeStyles.episodeInfoText}>{`${convertToLocale(
            episode.startTime
          )} - ${convertToLocale(episode.endTime)}`}</Text>
          <Text
            style={episodeStyles.episodeInfoText}
            numberOfLines={1}
          >{`with ${episode.initials.trim() || "N/A"}`}</Text>
        </View>
        <View style={episodeStyles.trashContainer}>
          <Ionicons
            name="trash-outline"
            style={episodeStyles.trashIcon}
            size={40}
            onPress={() => setClicked(true)}
          />
        </View>
      </View>
      <TouchableOpacity
        style={episodeStyles.deleteButton}
        onPress={deleteCallback}
      >
        <Text style={episodeStyles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const episodeStyles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    marginBottom: 20,
    height: 120,
  },
  numberContainer: {
    flex: 1,
    backgroundColor: Colors.avocadoGreen,
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
    color: Colors.avocadoGreen,
  },
  episodeInfoText: {
    fontFamily: "Arimo_400Regular",
    fontStyle: "normal",
    fontSize: 18,
    lineHeight: 22,
    color: Colors.avocadoGreen,
  },
  trashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EBEBEB",
  },
  trashIcon: {
    color: Colors.allowedButtonColor,
  },
  deleteButton: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    marginBottom: 20,
    height: 120,
    backgroundColor: Colors.allowedButtonColor,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteText: {
    fontFamily: "Arimo_700Bold",
    fontSize: 18,
    lineHeight: 22,
    color: "white",
  },
});

export default function EpisodeDisplayScreen({ route }: any) {
  const { episodes: initialEpisodes, recordingDay } = route.params;
  const [episodes, setEpisodes] = useState<any[]>(initialEpisodes);
  const navigator = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Current episodes</Text>
        <Ionicons
          name="add"
          style={styles.icon}
          size={40}
          onPress={() => navigator.goBack()}
        />
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
              deleteCallback={() => {
                const newEpisodes = episodes.filter((_, i) => i !== index);
                setEpisodes(newEpisodes);
                AsyncStorage.setItem(
                  STORAGE_KEYS.daysEpisodes(recordingDay),
                  JSON.stringify(newEpisodes)
                );
              }}
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
    alignItems: "center",
    justifyContent: "space-between",
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
  noneText: {
    color: Colors.avocadoGreen,
    fontFamily: "Arimo_700Bold",
    fontStyle: "normal",
    fontSize: 18,
    lineHeight: 22,
  },
  icon: {
    transform: [{ rotate: "45deg" }],
    color: Colors.avocadoGreen,
  },
});
