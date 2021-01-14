import { Linking, StyleSheet } from "react-native";
import { Text } from "../../../components/Themed";
import React from "react";
import AIntroScreen, { styles as abstractStyles } from "../AIntroScreen";
import Colors from "../../../constants/Colors";
import Contact from "../../../constants/Contact";

export default function Intro1() {
  return (
    <AIntroScreen headerText="Welcome to the Video Diary.">
      <Text style={abstractStyles.bodyText}>
        {
          "You will record a series of short videos describing your day. The next few pages explain how to do it. The diary should take approximately 20-30 minutes to complete.\n\nIf you have questions or concerns, please contact a research staff member "
        }
        <Text
          style={styles.bodyLink}
          onPress={() => Linking.openURL(Contact.contactLink)}
        >
          {"here"}
        </Text>
        {" or by phone at "}
        <Text
          style={styles.bodyContact}
          onPress={() => Linking.openURL(`tel:${Contact.contactPhone}`)}
        >
          {Contact.contactPhone}
        </Text>
        {"."}
      </Text>
    </AIntroScreen>
  );
}

const styles = StyleSheet.create({
  bodyContact: {
    color: Colors.linkOrange,
  },
  bodyLink: {
    color: Colors.linkOrange,
    textDecorationLine: "underline",
  },
});
