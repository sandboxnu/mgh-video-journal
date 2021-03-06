import { NavigationState } from "./navigation/MainNavigationContext";

export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};

export type AppStateStorage = {
  date: Date;
  state: NavigationState;
};

export type EpisodeInputStackParamList = {
  EpisodeInput: undefined;
  EpisodeDisplay: undefined;
  EpisodeConfirmation: undefined;
  EpisodeEdit: undefined;
};

export type Episode = {
  name: string;
  date: string; // ISO String
  startTime: string; // ISO String
  endTime: string; // ISO String
  initials: string;
  recordingDay: number;
};
