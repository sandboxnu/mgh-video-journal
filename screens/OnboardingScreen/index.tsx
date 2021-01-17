import React, { ReactElement, useState } from "react";
import { StyleSheet } from "react-native";
import Intro1 from "./Day1/Intro1";
import Intro2 from "./Day1/Intro2";
import Intro3 from "./Day1/Intro3";
import Intro4 from "./Day1/Intro4";
import Intro5 from "./Day1/Intro5";
import Intro1Day2 from "./Day2+3/Intro1Day2";
import Intro2Day2 from "./Day2+3/Intro2Day2";
import Intro3Day2 from "./Day2+3/Intro3Day2";
import { View } from "../../components/Themed";
import Swiper from "react-native-swiper";
import Colors from "../../constants/Colors";

interface OnboardingScreenProps {
  views: ReactElement[];
}

export const Day1Screens = [
  <Intro1 key={2235} />,
  <Intro2 key={22342} />,
  <Intro3 key={23262} />,
  <Intro4 key={7622} />,
  <Intro5 key={87922} />,
];
export const Day2And3Screens = (recordingDay: number) => [
  <Intro1Day2 key={22} recordingDay={recordingDay} />,
  <Intro2Day2 key={2} />,
  <Intro3Day2 key={5} />,
];

export default function OnboardingScreen({ views }: OnboardingScreenProps) {
  const [index, setIndex] = useState(0);
  const [canScroll, setCanScroll] = useState(false);

  return (
    <View style={styles.swiper}>
      <Swiper
        loop={false}
        index={0}
        onIndexChanged={(i) => setIndex(i)}
        dotColor="transparent"
        scrollEnabled={canScroll}
        dotStyle={
          index !== views.length - 1 && canScroll
            ? { ...styles.dotStyle, ...styles.dotSizing }
            : styles.noDotStyle
        }
        activeDotColor={Colors.allowedButtonColor}
        activeDotStyle={
          index !== views.length - 1 && canScroll
            ? styles.dotSizing
            : styles.noDotStyle
        }
      >
        {views.map((element) => React.cloneElement(element, { setCanScroll }))}
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
