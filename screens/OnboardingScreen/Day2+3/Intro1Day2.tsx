import React, { useEffect } from "react";
import { Text, View } from "../../../components/Themed";
import Colors from "../../../constants/Colors";
import { StyleSheet } from "react-native";

interface Intro1Day2Props {
  recordingDay: number;
  setCanScroll?: (canScrollHuh: boolean) => void;
}
export default function Intro1Day2({
  recordingDay,
  setCanScroll,
}: Intro1Day2Props) {
  // make sure the user can scroll
  useEffect(() => setCanScroll?.(true), []);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        Welcome to Day {recordingDay} of your Video Diary.
      </Text>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  headerText: {
    fontSize: 40,
    fontFamily: "Inter_700Bold",
    color: Colors.avocadoGreen,
    textAlign: "center",
  },
});
