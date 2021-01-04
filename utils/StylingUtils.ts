import Colors from "../constants/Colors";

export const continueButtonStyle = (notDisabled: boolean) => ({
  style: {
    backgroundColor: notDisabled
      ? Colors.allowedButtonColor
      : Colors.disabledButtonColor,
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    maxHeight: 60,
    borderRadius: 20,
  } as const,
});
