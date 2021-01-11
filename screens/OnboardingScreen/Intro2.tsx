import React from "react";
import AIntroScreen, { styles as abstractStyles } from "./AIntroScreen";
import { Text } from "../../components/Themed";

export default function Intro2() {
  return (
    <AIntroScreen headerText="Overview">
      <Text style={abstractStyles.bodyText}>
        {
          "First, you will break up your day into a series of episodes. Think of your day as a continuous series of episodes in a film. Each episode typically lasts between 15 minutes and 2 hours.\n\nAn episode might begin or end when you change locations, end one activity and start another, or there is a change in the people you are interacting with."
        }
      </Text>
    </AIntroScreen>
  );
}
