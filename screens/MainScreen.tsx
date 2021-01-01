import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { Button, StyleSheet } from "react-native";
import { signIn } from "../clients/firebaseInteractor";

import EditScreenInfo from "../components/EditScreenInfo";
import { Text, View } from "../components/Themed";

export default function MainScreen() {
  let navigation = useNavigation();
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
          navigation.navigate("PredictEpisodes");
        }}
        title={"Go to episode prediction"}
      />
      <Button
        onPress={() => {
          navigation.navigate("CameraFlow");
        }}
        title={"Go to camera"}
      />
      <Button
        onPress={() => {
          navigation.navigate("EpisodeInput");
        }}
        title={"Go to Episode Input"}
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
