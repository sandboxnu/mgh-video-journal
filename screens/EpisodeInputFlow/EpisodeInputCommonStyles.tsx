import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";

export const containerStyles = StyleSheet.create({
  container: {
    padding: 30,
    flex: 1,
    justifyContent: "space-around",
  },
  titleContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 30,
  },
  inputContainer: {
    flexDirection: "column",
  },
  buttonsContainer: {
    alignContent: "stretch",
  },
});

export const styles = StyleSheet.create({
  title: {
    fontFamily: "Inter_500Medium",
    fontStyle: "normal",
    fontSize: 30,
    lineHeight: 36,
    textAlign: "left",
    color: Colors.avocadoGreen,
  },
  input: {
    justifyContent: "center",
    marginTop: "2%",
  },
  inputHeader: {
    fontFamily: "Arimo_400Regular",
    fontStyle: "normal",
    fontSize: 18,
    lineHeight: 22,
    marginVertical: "2%",
    color: Colors.darkText,
  },
  inputText: {
    fontFamily: "Arimo_400Regular",
    fontStyle: "normal",
    fontSize: 18,
    lineHeight: 22,
    marginVertical: "2%",
    color: Colors.darkText,
  },
  greyText: {
    color: "#9c9c9c",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#979797",
    borderStyle: "solid",
    fontFamily: "Arimo_400Regular",
    fontStyle: "normal",
    fontSize: 20,
    lineHeight: 22,
    color: "#000000",
    backgroundColor: "white",
    padding: 15,
  },
  timePickers: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timePickerContainer: {
    borderWidth: 1,
    borderColor: "#979797",
    borderStyle: "solid",
    flex: 150,
    width: "45%",
  },
  button: {
    marginVertical: "3%",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    borderRadius: 20,
  },
  buttonGrey: {
    backgroundColor: "#8d8d8d",
  },
  buttonRed: {
    backgroundColor: Colors.allowedButtonColor,
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: "Inter_400Regular",
    fontStyle: "normal",
    fontSize: 20,
    lineHeight: 22,
  },
});
