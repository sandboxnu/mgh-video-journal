import React from "react";
import AIntroScreen, { styles as abstractStyles } from "../AIntroScreen";
import { Text, View } from "../../../components/Themed";
import LottieView from "lottie-react-native";

export default function Intro3() {
  return (
    <AIntroScreen headerText="Overview">
      <View style={abstractStyles.childrenBody}>
        <LottieView
          style={abstractStyles.image}
          loop
          source={require("../../../assets/animations/onboarding1.json")}
        />
        <Text style={abstractStyles.bodyText}>
          Please give each episode a brief name so you can reference it as you
          move through the diary. Then answer some brief questions about each
          episode.
        </Text>
      </View>
    </AIntroScreen>
  );
}
