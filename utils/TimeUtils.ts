import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "./AsyncStorageUtils";

// the length of a day in milliseconds
const DAY_IN_MS = 24 * 60 * 60 * 1000;
const EXACT_DATE = () => new Date();
// standardized current date that does not factor in the time it was created, just the date
export const getCurrentDate = () => {
  const currentDate = EXACT_DATE();
  // Subtract 5 hours so that we are doing this based on 5AM to 5AM
  const currentMGHDay = new Date(currentDate.getTime() - 5 * 60 * 1000 * 60);
  return new Date(
    currentMGHDay.getFullYear(),
    currentMGHDay.getMonth(),
    currentMGHDay.getDate(),
    0
  );
};

export const areDaysEqual = (day1: Date, day2: Date) => {
  return (
    new Date(
      day1.getFullYear(),
      day1.getMonth(),
      day1.getDate(),
      0
    ).toISOString() ===
    new Date(
      day2.getFullYear(),
      day2.getMonth(),
      day2.getDate(),
      0
    ).toISOString()
  );
};

export const calculateRecordingDay = (startDay: string) => {
  // check which "day" it is for them (day 1, 2, 3) based on the start day.
  // When you subtract them, it should only ever be 0 (same day), DAY_IN_MS (1 day later) or DAY_IN_MS * 2 (2 days later) since
  // current date and start day should always be the same time of day
  const msApart = getCurrentDate().getTime() - new Date(startDay).getTime();
  return msApart / DAY_IN_MS + 1;
};

export const retrieveRecordingDay = async () => {
  const startDay = await AsyncStorage.getItem(STORAGE_KEYS.startDay());
  if (startDay === null) {
    // if the startDay hasn't been set, this is their first time on this page, so set it to the current date
    // current date is only based on year/month/date so the time will always be the same across days
    await AsyncStorage.setItem(
      STORAGE_KEYS.startDay(),
      getCurrentDate().toISOString()
    );
    return 1;
  } else {
    // Add one so it's standardixed as day 1, 2, or 3
    return calculateRecordingDay(startDay);
  }
};

export const convertToLocale = (iso: string): string => {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};
