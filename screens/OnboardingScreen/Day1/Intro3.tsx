import React from "react";
import AIntroScreen, { styles as abstractStyles } from "../AIntroScreen";
import { Text, View } from "../../../components/Themed";
import LottieView from "lottie-react-native";
import { useWindowDimensions } from "react-native";

export default function Intro3() {
  const { width } = useWindowDimensions();

  return (
    <AIntroScreen headerText="Overview">
      <View style={abstractStyles.childrenBody}>
        <View>
          <LottieView
            style={{
              ...abstractStyles.image,
              width,
              marginTop: -15,
              marginBottom: -75,
            }}
            source={require("../../../assets/animations/onboarding.json")}
            autoPlay
            loop
          />
        </View>
        <Text style={{ ...abstractStyles.bodyText }}>
          Please give each episode a brief name so you can reference it as you
          move through the diary. Then answer some brief questions about each
          episode.
        </Text>
      </View>
    </AIntroScreen>
  );
}
