import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { Button, Text, View } from "../components/Themed";
import Colors from "../constants/Colors";
import { useMainNavigation } from "../hooks/useMainNavigation";
import { NavigationScreens } from "../navigation/MainNavigationContext";
import { continueButtonStyle } from "../utils/StylingUtils";

export const ClearEpisodeScreen = () => {
  const mainNavigation = useMainNavigation();
  const [password, setPassword] = useState("");

  const validatePassword = async () => {
    if (password === "aVocado!") {
      await AsyncStorage.clear();
      mainNavigation.navigate({ type: NavigationScreens.onboarding });
    }
  };
  return (
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss()}
      accessible={false}
    >
      <View style={ClearScreenStyles.container}>
        <Text style={ClearScreenStyles.text}>
          Thank you for participating in the study! {"\n\n"}
          If you're a researcher, please put in the password to restart the
          study for the next participate.
          {"\n\n"}
        </Text>
        <TextInput
          style={{ ...ClearScreenStyles.textInput }}
          maxLength={70}
          onChangeText={setPassword}
          placeholder={"password"}
          editable
        />
        <Button
          style={continueButtonStyle(true).style}
          onPress={validatePassword}
        >
          <Text style={ClearScreenStyles.buttonText}>Restart Study</Text>
        </Button>
      </View>
    </TouchableWithoutFeedback>
  );
};

const ClearScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.avocadoGreen,
    justifyContent: "center",
    padding: 30,
  },
  text: {
    color: "white",
    fontSize: 18,
    fontFamily: "Arimo_400Regular",
    textAlign: "center",
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
    backgroundColor: "#FFF",
    padding: 15,
    marginBottom: 30,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "400",
    color: "white",
  },
});
