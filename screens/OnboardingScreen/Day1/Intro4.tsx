import React from "react";
import AIntroScreen, { styles as abstractStyles } from "../AIntroScreen";
import { Text, View } from "../../../components/Themed";
import { Image, useWindowDimensions } from "react-native";

const heightWidthRatio = 690 / 600;

export default function Intro4() {
  const { width: windowWidth } = useWindowDimensions();
  // because of padding 50 on container
  const width = windowWidth - 100;
  return (
    <AIntroScreen headerText="Overview">
      <View style={abstractStyles.childrenBody}>
        <Image
          style={{
            ...abstractStyles.image,
            borderBottomWidth: 1,
            width,
            height: heightWidthRatio * width,
          }}
          source={require("../../../assets/animations/onboarding2.gif")}
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
