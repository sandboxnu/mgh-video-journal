import { StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
import React, { ReactChild } from "react";
import Colors from "../../constants/Colors";

export interface AIntroScreenProps {
  headerText: string;
  children: ReactChild | Array<ReactChild>;
}

export default function AIntroScreen({
  headerText,
  children,
}: AIntroScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{headerText}</Text>
      </View>
      <View style={styles.body}>{children}</View>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
    justifyContent: "space-around",
  },
  header: {
    justifyContent: "center",
    marginVertical: 60,
  },
  headerText: {
    fontSize: 40,
    fontFamily: "Inter_700Bold",
    color: Colors.avocadoGreen,
  },
  body: { flex: 1, justifyContent: "space-between" },
  bodyText: {
    color: Colors.darkText,
    fontSize: 18,
    fontFamily: "Arimo_400Regular",
  },
  childrenBody: {
    marginTop: -50,
    flex: 1,
  },
  image: {
    alignSelf: "center",
    marginBottom: 20,
  },
});
