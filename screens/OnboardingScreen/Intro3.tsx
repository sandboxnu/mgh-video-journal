import React from "react";

import AIntroScreen, { styles as abstractStyles } from "./AIntroScreen";
import { Image } from "react-native";
import { Text, View } from "../../components/Themed";

export default function Intro3() {
  return (
    <AIntroScreen headerText="Overview">
      <View style={abstractStyles.childrenBody}>
        <Image
          style={abstractStyles.image}
          source={require("../../assets/images/old-man.png")}
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
