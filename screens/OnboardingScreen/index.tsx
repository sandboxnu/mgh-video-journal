import React, { useState } from "react";
import { StyleSheet } from "react-native";
import Intro1 from "./Intro1";
import Intro2 from "./Intro2";
import Intro3 from "./Intro3";
import Intro4 from "./Intro4";
import Intro5 from "./Intro5";
import { View } from "../../components/Themed";
import Swiper from "react-native-swiper";
import Colors from "../../constants/Colors";

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);

  return (
    <View style={styles.swiper}>
      <Swiper
        loop={false}
        index={0}
        onIndexChanged={(i) => setIndex(i)}
        dotColor="transparent"
        dotStyle={
          index !== 4
            ? { ...styles.dotStyle, ...styles.dotSizing }
            : styles.noDotStyle
        }
        activeDotColor={Colors.allowedButtonColor}
        activeDotStyle={index !== 4 ? styles.dotSizing : styles.noDotStyle}
      >
        <Intro1 />
        <Intro2 />
        <Intro3 />
        <Intro4 />
        <Intro5 />
      </Swiper>
    </View>
  );
}

const styles = StyleSheet.create({
  swiper: {
    flex: 1,
  },
  dotStyle: {
    borderColor: Colors.allowedButtonColor,
    borderWidth: 1,
  },
  dotSizing: {
    borderRadius: 10,
    width: 20,
    height: 20,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 50,
  },
  noDotStyle: {
    display: "none",
  },
});
