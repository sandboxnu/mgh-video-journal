import {
  Keyboard,
  Linking,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { Text, View } from "../../../components/Themed";
import React, { useState } from "react";
import AIntroScreen, { styles as abstractStyles } from "../AIntroScreen";
import Colors from "../../../constants/Colors";
import Contact from "../../../constants/Contact";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../../../utils/AsyncStorageUtils";

interface Intro1Props {
  setCanScroll?: (canScroll: boolean) => void;
}

export default function Intro1({ setCanScroll }: Intro1Props) {
  const [participantId, setParticipantId] = useState("");
  const storeParticipantId = async () => {
    if (participantId !== "") {
      setCanScroll?.(true);
      await AsyncStorage.setItem(STORAGE_KEYS.participantId(), participantId);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
          {".\n\n"}
        </Text>
        <View>
          <Text style={styles.inputHeader}>
            Please enter your participant ID:
          </Text>
          <TextInput
            style={{ ...styles.textInput }}
            maxLength={70}
            onChangeText={setParticipantId}
            value={participantId}
            onEndEditing={storeParticipantId}
            editable
          />
        </View>
      </AIntroScreen>
    </TouchableWithoutFeedback>
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
  inputHeader: {
    fontFamily: "Arimo_400Regular",
    fontStyle: "normal",
    fontSize: 18,
    lineHeight: 22,
    marginVertical: "2%",
    color: Colors.avocadoGreen,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#979797",
    borderStyle: "solid",
    fontFamily: "Arimo_400Regular",
    fontStyle: "normal",
    fontSize: 20,
    lineHeight: 22,
    color: Colors.avocadoGreen,
    marginBottom: 50,
    padding: 15,
  },
});
