import React from "react";
import AIntroScreen, { styles as abstractStyles } from "../AIntroScreen";
import { Button, Text } from "../../../components/Themed";
import Colors from "../../../constants/Colors";
import { Linking, StyleSheet } from "react-native";
import { NavigationScreens } from "../../../navigation/MainNavigationContext";
import { useMainNavigation } from "../../../hooks/useMainNavigation";
import Contact from "../../../constants/Contact";

export default function Intro3Day2() {
  const navigation = useMainNavigation();
  return (
    <AIntroScreen headerText="Overview">
      <Text style={abstractStyles.bodyText}>
        As always, if you have questions or concerns, please contact a research
        staff member at{" "}
        <Text
          style={styles.bodyLink}
          onPress={() => Linking.openURL(Contact.contactLink)}
        >
          here
        </Text>{" "}
        or by phone at{" "}
        <Text
          style={styles.bodyContact}
          onPress={() => Linking.openURL(`tel:${Contact.contactPhone}`)}
        >
          {Contact.contactPhone}
        </Text>
        .{"\n\n"}Thank you!
      </Text>
      <Button
        style={styles.getStartedButton}
        onPress={() => {
          navigation.navigate({
            type: NavigationScreens.episodeListingOverview,
          });
        }}
      >
        <Text style={styles.buttonText}>Get started</Text>
      </Button>
    </AIntroScreen>
  );
}

const styles = StyleSheet.create({
  getStartedButton: {
    marginVertical: 50,
    backgroundColor: Colors.allowedButtonColor,
    borderRadius: 20,
  },
  buttonText: {
    textAlign: "center",
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    color: "white",
    marginVertical: 20,
  },
  bodyContact: {
    color: Colors.linkOrange,
  },
  bodyLink: {
    color: Colors.linkOrange,
    textDecorationLine: "underline",
  },
});
