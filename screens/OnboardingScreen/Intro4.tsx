import React from "react";
import AIntroScreen, { styles as abstractStyles } from "./AIntroScreen";
import { Text, View } from "../../components/Themed";
import { Image } from "react-native";

export default function Intro4() {
  return (
    <AIntroScreen headerText="Overview">
      <View style={abstractStyles.childrenBody}>
        <Image
          style={abstractStyles.image}
          source={require("../../assets/images/avocado-man.png")}
        />
        <Text style={abstractStyles.bodyText}>
          After you have identified and named your episodes, you will complete a
          video recording for each episode. In each video, you will give a
          detailed description of that episode.
        </Text>
      </View>
    </AIntroScreen>
  );
}
