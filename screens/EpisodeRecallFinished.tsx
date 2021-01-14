import React, { FunctionComponent, useEffect, useState } from "react";
import { View, Text, Button } from "../components/Themed";
import { StyleSheet } from "react-native";
import { continueButtonStyle } from "../utils/StylingUtils";
import { useMainNavigation } from "../hooks/useMainNavigation";
import Colors from "../constants/Colors";
import { NavigationScreens } from "../navigation/MainNavigationContext";

function EvenSpacedView() {
  return <View style={{ flex: 1, backgroundColor: "transparent" }} />;
}

interface EpisodeRecallFinishedProps {
  recordingDay: number;
}

export const EpisodeRecallFinished: FunctionComponent<EpisodeRecallFinishedProps> = ({
  recordingDay,
}: EpisodeRecallFinishedProps) => {
  const navigation = useMainNavigation();

  return (
    <View style={EpisodeRecallOverviewStyles.container}>
      <View style={EpisodeRecallOverviewStyles.titleView}>
        <EvenSpacedView />
        <Text style={EpisodeRecallOverviewStyles.title}>
          Thank you for recalling your episodes
        </Text>
      </View>
      {recordingDay === 2 ? (
        <>
          <Text style={EpisodeRecallOverviewStyles.subtext}>
            We will now move onto the next part of the Video Diary for today,
            where you will list and tells us about Episodes that happened today.
            {"\n\n"}
            This will look the same as what you completed yesterday, but we will
            still provide you with instructions as reminders.
          </Text>
          <Button
            style={continueButtonStyle(true).style}
            onPress={() => {
              navigation.navigate({ type: NavigationScreens.createEpisode });
            }}
          >
            <Text style={EpisodeRecallOverviewStyles.buttonText}>
              Get Started!
            </Text>
          </Button>
        </>
      ) : (
        <>
          <Text style={EpisodeRecallOverviewStyles.subtext}>
            We will now move onto the next part of the Video Diary for today,
            where you will list Episodes that happened yesterday.{"\n\n"}
            This will look the same as what you completed yesterday, but we will
            still provide you with instructions as reminders.
          </Text>
          <Button
            style={continueButtonStyle(true).style}
            onPress={() => {
              navigation.navigate({
                type: NavigationScreens.secondEpisodeListingOverview,
              });
            }}
          >
            <Text style={EpisodeRecallOverviewStyles.buttonText}>
              Get Started!
            </Text>
          </Button>
        </>
      )}
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
