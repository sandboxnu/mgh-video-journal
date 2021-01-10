import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { Button, StyleSheet } from "react-native";
import { signIn } from "../clients/firebaseInteractor";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";
import { useMainNavigation } from "../hooks/useMainNavigation";
import { NavigationScreens } from "../navigation/MainNavigationContext";

export default function MainScreen() {
  let context = useMainNavigation();
  useEffect(() => {
    // The email gets ignored rn, but will be used when we get to the email auth
    signIn("email");
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My New</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
      <Button
        onPress={() => {
          context.navigate({ type: NavigationScreens.createEpisode });
        }}
        title={"Go to Day 1"}
      />
      <Button
        onPress={() => {
          context.navigate({ type: NavigationScreens.episodeListingOverview });
        }}
        title={"Go to Day 2"}
      />
      <Button
        onPress={() => {
          AsyncStorage.clear();
        }}
        title={"Clear Local Storage"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
