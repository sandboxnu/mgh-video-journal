import React, { FunctionComponent } from "react";
import { Linking, StyleSheet } from "react-native";
import { View, Text } from "../components/Themed";
import Colors from "../constants/Colors";
import { continueButtonStyle } from "../utils/StylingUtils";
import Contact from "../constants/Contact";
import { EvenSpacedView } from "../components/EvenSpacedView";

interface ThankYouScreenProps {
  recordingDay: number;
}

export const ThankYouScreen: FunctionComponent<ThankYouScreenProps> = ({
  recordingDay,
}) => {
  return (
    <View style={ThankYouScreenStyles.container}>
      <View style={ThankYouScreenStyles.titleView}>
        <EvenSpacedView />
        <Text style={ThankYouScreenStyles.title}> Thank you!</Text>
      </View>

      {recordingDay === 1 || recordingDay === 2 ? (
        <Text style={ThankYouScreenStyles.subtext}>
          Thank you for completing Day {recordingDay} of your Video Diary!
          Tomorrow you will complete Day {recordingDay + 1}. {"\n\n"}
          Remember, if you have questions or concerns, please contact a research
          staff member{" "}
          <Text
            style={ThankYouScreenStyles.bodyLink}
            onPress={() => Linking.openURL(Contact.contactLink)}
          >
            here
          </Text>{" "}
          or by phone at{" "}
          <Text
            style={ThankYouScreenStyles.bodyContact}
            onPress={() => Linking.openURL(`tel:${Contact.contactPhone}`)}
          >
            {Contact.contactPhone}
          </Text>
          . {"\n\n"}
          Thank you again for taking the time to participate in our study. We
          know your time is valuable and we are grateful for your contributions
          to science. {"\n\n"}
          You are now done for the day. We will see you again tomorrow!
        </Text>
      ) : (
        <Text style={ThankYouScreenStyles.subtext}>
          Thank you for completing Day {recordingDay} of your Video Diary! You
          are now complete with the study.{"\n\n"}
          Remember, if you have questions or concerns, please contact a research
          staff member{" "}
          <Text
            style={ThankYouScreenStyles.bodyLink}
            onPress={() => Linking.openURL(Contact.contactLink)}
          >
            here
          </Text>{" "}
          or by phone at{" "}
          <Text
            style={ThankYouScreenStyles.bodyContact}
            onPress={() => Linking.openURL(`tel:${Contact.contactPhone}`)}
          >
            {Contact.contactPhone}
          </Text>
          . {"\n\n"}
          Thank you again for taking the time to participate in our study. We
          know your time is valuable and we are grateful for your contributions
          to science. {"\n\n"}
        </Text>
      )}
    </View>
  );
};

const ThankYouScreenStyles = StyleSheet.create({
  titleView: {
    flex: 1,
    margin: 0,
    padding: 0,
  },
  title: {
    fontWeight: "700",
    flex: 1,
    fontSize: 40,
    textAlign: "left",
    color: Colors.avocadoGreen,
    fontFamily: "Arimo_700Bold",
    lineHeight: 48.4,
  },
  container: {
    flex: 1,
    paddingTop: 25,
    justifyContent: "flex-start",
    paddingRight: 24,
    paddingLeft: 24,
    paddingBottom: 25,
  },
  subtext: {
    flex: 5,
    fontWeight: "400",
    fontSize: 18,
    fontFamily: "Arimo_400Regular",
    color: Colors.avocadoGreen,
  },
  button: {
    ...continueButtonStyle(true).style,
    maxHeight: 60,
  },
  bodyContact: {
    color: Colors.linkOrange,
  },
  bodyLink: {
    color: Colors.linkOrange,
    textDecorationLine: "underline",
  },
});
