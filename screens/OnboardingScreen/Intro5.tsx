import React from "react";
import { StyleSheet } from "react-native";
import { Button, Text, View } from "../../components/Themed";
import Colors from "../../constants/Colors";
import { useMainNavigation } from "../../hooks/useMainNavigation";
import { NavigationScreens } from "../../navigation/MainNavigationContext";
import AIntroScreen from "./AIntroScreen";

export default function Intro5() {
  const navigation = useMainNavigation();
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        Let's walk through each step together!
      </Text>
      <Button
        style={styles.getStartedButton}
        onPress={() => {
          navigation.navigate({ type: NavigationScreens.createEpisode });
        }}
      >
        <Text style={styles.buttonText}>Get started</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: "10%",
    flex: 1,
    backgroundColor: Colors.avocadoGreen,
    flexDirection: "column",
  },
  headerText: {
    fontSize: 40,
    fontFamily: "Inter_700Bold",
    color: "white",
    marginTop: "auto",
    marginBottom: "auto",
  },
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
});
