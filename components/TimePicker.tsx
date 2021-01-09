import React, { useState } from "react";
import { Button, Text, View } from "./Themed";
import Icon from "react-native-vector-icons/Octicons";
import { StyleProp, ViewStyle, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface TimeProps {
  time: Date | undefined;
  setTime: (time: Date | undefined) => void;
  label: string;
  style: StyleProp<ViewStyle>;
}

export function TimePicker({ time, setTime, label, style }: TimeProps) {
  const [isVisible, setVisibility] = useState(false);
  const handleConfirm = (date: Date, setTime: (time: Date) => void) => {
    setTime(date);
    hideDatePicker();
  };

  const showDatePicker = () => {
    setVisibility(true);
  };

  const hideDatePicker = () => {
    setVisibility(false);
  };
  return (
    <View style={style}>
      <Button onPress={showDatePicker} style={datePickerStyles.timeButton}>
        <View style={datePickerStyles.contentWrapper}>
          <Text style={datePickerStyles.text}>
            {time
              ? time.toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  timeZone: "UTC",
                })
              : label}
          </Text>
          <Icon
            name="chevron-down"
            size={20}
            color="#000"
            style={datePickerStyles.icon}
          />
        </View>
      </Button>
      <DateTimePickerModal
        headerTextIOS={`Please enter the episode ${label.toLowerCase()}:`}
        isVisible={isVisible}
        mode="time"
        onConfirm={(date) => handleConfirm(date, setTime)}
        onCancel={hideDatePicker}
      />
    </View>
  );
}

const datePickerStyles = StyleSheet.create({
  timeButton: {
    backgroundColor: "transparent",
  },
  contentWrapper: {
    marginHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: "auto",
  },
  text: {
    fontFamily: "Arimo_400Regular",
    fontStyle: "normal",
    fontSize: 18,
    lineHeight: 22,
    paddingVertical: 15,
  },
});
